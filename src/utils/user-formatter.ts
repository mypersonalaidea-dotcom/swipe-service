export class UserFormatter {
  static formatUser(user: any) {
    if (!user) return user;

    // Flatten user habits into label arrays
    if (user.user_habits && Array.isArray(user.user_habits)) {
      user.user_habits = user.user_habits
        .map((uh: any) => uh.habit?.label || uh.habit_label)
        .filter(Boolean);
    }

    // Flatten looking for habits into label arrays
    if (user.looking_for_habits && Array.isArray(user.looking_for_habits)) {
      user.looking_for_habits = user.looking_for_habits
        .map((uh: any) => uh.habit?.label || uh.habit_label)
        .filter(Boolean);
    }

    // Format job experiences as structured objects (with string fallback)
    if (user.job_experiences && Array.isArray(user.job_experiences)) {
      user.workExperience = user.job_experiences
        .map((job: any) => {
          const pos = job.position?.common_name || job.position_name;
          const comp = job.company?.name || job.company_name;
          const from = job.from_year || '';
          const till = job.currently_working ? 'Present' : (job.till_year || '');
          const years = from && till ? ` | ${from} – ${till}` : (from ? ` | ${from}` : '');
          if (pos && comp) return `${pos} at ${comp}${years}`;
          return (pos || comp) ? `${pos || comp}${years}` : null;
        })
        .filter(Boolean);

      // Also send structured data for rich display
      user.jobExperiencesDetailed = user.job_experiences
        .map((job: any) => ({
          id: job.id,
          position: job.position?.common_name || job.position_name || '',
          company: job.company?.name || job.company_name || '',
          companyLogo: job.company?.logo_url || null,
          companyWebsite: job.company?.website || null,
          fromYear: job.from_year || '',
          tillYear: job.till_year || '',
          currentlyWorking: job.currently_working || false,
        }))
        .filter((j: any) => j.position || j.company);
    } else {
      user.workExperience = [];
      user.jobExperiencesDetailed = [];
    }

    // Format education experiences as structured objects (with string fallback)
    if (user.education_experiences && Array.isArray(user.education_experiences)) {
      user.education = user.education_experiences
        .map((edu: any) => {
          const deg = edu.degree?.common_name || edu.degree_name;
          const inst = edu.institution?.name || edu.institution_name;
          const from = edu.start_year || '';
          const till = edu.end_year || '';
          const years = from && till ? ` | ${from} – ${till}` : (from ? ` | ${from}` : (till ? ` | ${till}` : ''));
          if (deg && inst) return `${deg} from ${inst}${years}`;
          return (deg || inst) ? `${deg || inst}${years}` : null;
        })
        .filter(Boolean);

      // Also send structured data for rich display
      user.educationDetailed = user.education_experiences
        .map((edu: any) => ({
          id: edu.id,
          institution: edu.institution?.name || edu.institution_name || '',
          degree: edu.degree?.common_name || edu.degree_name || '',
          institutionLogo: edu.institution?.logo_url || null,
          startYear: edu.start_year || '',
          endYear: edu.end_year || '',
        }))
        .filter((e: any) => e.institution || e.degree);
    } else {
      user.education = [];
      user.educationDetailed = [];
    }

    return user;
  }
}
