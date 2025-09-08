import {User} from '../../models/userSchema.js';
import {Job} from '../../models/jobSchema.js';

const GetStats = async (req, res) => {
  try {
    // Count jobs
    const totalJobs = await Job.countDocuments();
    // Count employers (assuming role: 'employer')
    const totalEmployers = await User.countDocuments({ role: 'Employer' });
    // Count job seekers (assuming role: 'jobseeker')
    const totalJobSeekers = await User.countDocuments({ role: 'Job Seeker' });

    res.status(200).json({
      success: true,
      totalJobs,
      totalEmployers,
      totalJobSeekers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default GetStats;
