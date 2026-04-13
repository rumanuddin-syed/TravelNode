import Booking from "../models/Booking.js";
import Mediator from "../models/Mediator.js";
import User from "../models/User.js";

// Utility to start/end of current month for filtering
const getStartOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Fetch all 'paid' bookings
    const paidBookings = await Booking.find({ paymentStatus: "paid" });

    // Revenue Models
    let totalRevenue = 0;
    let totalMediatorPayouts = 0; // 95% of mediator fees
    let platformProfit = 0; // Total Revenue - 95% of Mediator Fees
    
    // Monthly trend tracking
    const revenueByMonth = {};
    const bookingsByMonth = {};

    // Popular tour tracking
    const tourCounts = {};

    paidBookings.forEach((booking) => {
      const price = booking.totalPrice || 0;
      totalRevenue += price;

      // Mediator Fee calculation
      let mediatorNet = 0;
      if (booking.mediatorId && booking.costPerHour && booking.hours) {
        const grossFee = booking.costPerHour * booking.hours;
        mediatorNet = grossFee * 0.95; // 95% kept by mediator
        totalMediatorPayouts += mediatorNet;
      }

      // Trends over time
      const date = new Date(booking.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + price;
      bookingsByMonth[monthYear] = (bookingsByMonth[monthYear] || 0) + 1;

      // Top Tours
      tourCounts[booking.tourName] = (tourCounts[booking.tourName] || 0) + 1;
    });

    platformProfit = totalRevenue - totalMediatorPayouts;

    // Convert trends to arrays for charts
    const trendData = Object.keys(revenueByMonth).map(month => ({
      name: month,
      revenue: revenueByMonth[month],
      bookings: bookingsByMonth[month]
    })).sort((a,b) => new Date(a.name) - new Date(b.name));

    // Sort tours by booking count
    const popularTours = Object.entries(tourCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // General Insights
    const totalBookingsCount = paidBookings.length;
    
    // User Insights
    const totalUsers = await User.countDocuments({ role: "user" });
    const uniqueBookedUserIds = new Set(paidBookings.map(b => b.userId));
    const activeUsers = uniqueBookedUserIds.size;

    // Mediator Insights
    const totalMediators = await Mediator.countDocuments();
    
    // Top Earning Mediators (Aggregate from paid bookings)
    const mediatorEarningsMap = {};
    const mediatorTripCounts = {};
    
    paidBookings.forEach(booking => {
      if (booking.mediatorId) {
        const mId = booking.mediatorId.toString();
        const grossFee = (booking.costPerHour || 0) * (booking.hours || 0);
        const netFee = grossFee * 0.95;
        
        mediatorEarningsMap[mId] = (mediatorEarningsMap[mId] || 0) + netFee;
        mediatorTripCounts[mId] = (mediatorTripCounts[mId] || 0) + 1;
      }
    });

    // We have the Mediator IDs, let's look up names
    const topMediatorsRaw = Object.entries(mediatorEarningsMap)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5); // top 5
      
    const topMediators = [];
    for (const [mId, earnings] of topMediatorsRaw) {
      const med = await Mediator.findById(mId).populate("userId", "username");
      if (med) {
        topMediators.push({
          name: med.userId?.username || "Unknown",
          earnings: earnings,
          trips: mediatorTripCounts[mId] || 0
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        revenueAnalytics: {
          totalRevenue,
          totalMediatorPayouts,
          platformProfit
        },
        bookingInsights: {
          totalBookings: totalBookingsCount,
          popularTours
        },
        userInsights: {
          totalUsers,
          activeUsers
        },
        mediatorInsights: {
          totalMediators,
          topMediators
        },
        trendData
      }
    });

  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMediatorAnalytics = async (req, res) => {
  try {
    const userId = req.id;
    
    // Get the Mediator profile mapping to this user
    const mediatorProfile = await Mediator.findOne({ userId });
    
    if (!mediatorProfile) {
      return res.status(404).json({ success: false, message: "Mediator profile not found." });
    }

    // Find bookings assigned to this mediator where payment is paid
    const mediatorBookings = await Booking.find({ 
      mediatorId: mediatorProfile._id,
      paymentStatus: "paid"
    });

    let totalGrossFee = 0;
    const monthlyDataMap = {};
    const tourCounts = {};

    let upcomingTrips = 0;
    let completedTrips = 0;
    const now = new Date();

    mediatorBookings.forEach((booking) => {
      const grossFee = (booking.costPerHour || 0) * (booking.hours || 0);
      totalGrossFee += grossFee;

      // Trends over time
      const date = new Date(booking.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyDataMap[monthYear]) {
        monthlyDataMap[monthYear] = { name: monthYear, gross: 0, trips: 0 };
      }
      monthlyDataMap[monthYear].gross += grossFee;
      monthlyDataMap[monthYear].trips += 1;

      // Top Tours
      tourCounts[booking.tourName] = (tourCounts[booking.tourName] || 0) + 1;

      // Upcoming vs Completed
      const endDate = new Date(booking.endDate);
      if (endDate >= now) {
         upcomingTrips++;
      } else {
         completedTrips++;
      }
    });

    const netEarnings = totalGrossFee * 0.95;
    const platformFeeDeducted = totalGrossFee * 0.05;

    const monthlyTrends = Object.values(monthlyDataMap).map(m => ({
      name: m.name,
      earnings: m.gross * 0.95, // Mediator sees their NET earnings in charts
      trips: m.trips
    })).sort((a,b) => new Date(a.name) - new Date(b.name));

    const popTours = Object.entries(tourCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({
      success: true,
      data: {
        earningsSummary: {
          totalNetEarnings: netEarnings,
          platformFeeDeducted,
          grossFee: totalGrossFee
        },
        tripPerformance: {
          totalTrips: mediatorBookings.length,
          upcomingTrips,
          completedTrips
        },
        popularTours: popTours,
        monthlyTrends
      }
    });

  } catch (error) {
    console.error("Error fetching mediator analytics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
