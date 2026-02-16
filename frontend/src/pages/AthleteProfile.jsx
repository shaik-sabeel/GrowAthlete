import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { getFallbackAvatar } from "../utils/avatarUtils";

import '../pages_css/AthletesPage.css';

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

function AthleteProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isWikidata = id.startsWith('wikidata:');

    const fetchDbAthlete = async () => {
      const res = await api.get(`/auth/profile/${id}`);
      const user = res?.data?.user || null;
      if (!user) return null;

      let imageUrl = user.profileImageUrl || user.profilePicture || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      return {
        id: user._id,
        name: user.username || '',
        sport: user.sport || '',
        location: user.location || '',
        image: imageUrl,
        bio: user.bio || '',
        gender: user.gender || ''
      };
    };

    const fetchWikidataAthlete = async () => {
      const qid = id.replace('wikidata:', '');
      const query = `SELECT ?athlete ?athleteLabel ?sportLabel ?countryLabel ?image ?description WHERE { OPTIONAL { wd:${qid} wdt:P641 ?sport. } OPTIONAL { wd:${qid} wdt:P27 ?country. } OPTIONAL { wd:${qid} wdt:P18 ?image. } SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". wd:${qid} rdfs:label ?athleteLabel. wd:${qid} schema:description ?description. } } LIMIT 1`;
      const res = await fetch(`${WIKIDATA_SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}`, {
        headers: { 'Accept': 'application/sparql-results+json' }
      });
      if (!res.ok) throw new Error(`Wikidata fetch failed: ${res.status}`);
      const json = await res.json();
      const row = json?.results?.bindings?.[0];
      const toFilename = (url) => {
        if (!url) return '';
        try { return decodeURIComponent(url.split('/').pop() || ''); } catch { return ''; }
      };
      const filename = toFilename(row?.image?.value || '');
      return {
        id,
        name: row?.athleteLabel?.value || qid,
        sport: row?.sportLabel?.value || '',
        location: row?.countryLabel?.value || '',
        image: filename ? `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}` : '',
        bio: row?.description?.value || ''
      };
    };

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = id.startsWith('wikidata:') ? await fetchWikidataAthlete() : await fetchDbAthlete();
        setData(profile);
      } catch (err) {
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="ap-loading-state">Loading profile...</div>;
  if (error) return <div className="ap-error-state">{error}</div>;
  if (!data) return <div className="ap-error-state">Profile not found.</div>;

  return (
    <div className="ap-page container">
      <div className="ap-athlete-card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <img
          className="ap-athlete-image"
          src={data.image || getFallbackAvatar(data.gender)}
          alt={data.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getFallbackAvatar(data.gender);
          }}
        />
        <div className="ap-athlete-info">
          <h3>{data.name}</h3>
          {data.sport ? <p>{data.sport}</p> : <p>Sport: N/A</p>}
          {data.location ? <small>{data.location}</small> : <small>Location: N/A</small>}
          {data.bio && <p style={{ marginTop: 12 }}>{data.bio}</p>}
        </div>
      </div>
    </div>
  );
}

export default AthleteProfile;
