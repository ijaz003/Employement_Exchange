
import { Job } from '../../models/jobSchema.js';

export const GetLatestJobs = async (req, res, next) => {
	try {
		const jobs = await Job.find({ expired: false })
			.sort({ jobPostedOn: -1 })
			.limit(9);
		res.status(200).json({ success: true, jobs });
	} catch (error) {
		next(error);
	}
};
