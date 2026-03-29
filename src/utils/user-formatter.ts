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

    // Flatten job experiences into workExperience strings
    if (user.job_experiences && Array.isArray(user.job_experiences)) {
      user.workExperience = user.job_experiences
        .map((job: any) => {
          const pos = job.position?.common_name || job.position_name;
          const comp = job.company?.name || job.company_name;
          if (pos && comp) return `${pos} at ${comp}`;
          return pos || comp;
        })
        .filter(Boolean);
    } else {
      user.workExperience = [];
    }

    // Flatten education experiences into education strings
    if (user.education_experiences && Array.isArray(user.education_experiences)) {
      user.education = user.education_experiences
        .map((edu: any) => {
          const deg = edu.degree?.common_name || edu.degree_name;
          const inst = edu.institution?.name || edu.institution_name;
          if (deg && inst) return `${deg} from ${inst}`;
          return deg || inst;
        })
        .filter(Boolean);
    } else {
      user.education = [];
    }

    return user;
  }
}
