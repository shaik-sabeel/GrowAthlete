const Event = require('../models/Event');

/**
 * Updates event statuses automatically
 * - Marks events as 'completed' when their date has passed
 * - This function should be called periodically (e.g., daily via cron job)
 */
const updateEventStatuses = async () => {
  try {
    const currentDate = new Date();
    
    // Find all published/approved events that have passed their date
    const pastEvents = await Event.find({
      status: { $in: ['published', 'approved'] },
      date: { $lt: currentDate }
    });
    
    if (pastEvents.length > 0) {
      // Update status to completed
      const updateResult = await Event.updateMany(
        {
          _id: { $in: pastEvents.map(event => event._id) }
        },
        {
          $set: { 
            status: 'completed',
            completedAt: currentDate
          }
        }
      );
      
      console.log(`Updated ${updateResult.modifiedCount} events to completed status`);
      return updateResult.modifiedCount;
    }
    
    return 0;
  } catch (error) {
    console.error('Error updating event statuses:', error);
    throw error;
  }
};

/**
 * Gets upcoming events count for dashboard
 */
const getUpcomingEventsCount = async () => {
  try {
    const currentDate = new Date();
    const upcomingEvents = await Event.countDocuments({
      status: { $in: ['published', 'approved'] },
      date: { $gte: currentDate }
    });
    
    return upcomingEvents;
  } catch (error) {
    console.error('Error getting upcoming events count:', error);
    return 0;
  }
};

/**
 * Gets events happening today
 */
const getTodayEvents = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todayEvents = await Event.find({
      status: { $in: ['published', 'approved'] },
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ date: 1 });
    
    return todayEvents;
  } catch (error) {
    console.error('Error getting today\'s events:', error);
    return [];
  }
};

module.exports = {
  updateEventStatuses,
  getUpcomingEventsCount,
  getTodayEvents
};
