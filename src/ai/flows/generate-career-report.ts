'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive career report based on student input.
 *
 * - generateCareerReport - A function that handles the career report generation process.
 * - GenerateCareerReportInput - The input type for the generateCareerReport function.
 * - GenerateCareerReportOutput - The return type for the generateCareerReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerReportInputSchema = z.object({
  fullName: z.string().describe('The full name of the student.'),
  educationBackground: z.string().describe('The educational background of the student (e.g., "Bachelor in Computer Science from University A", "High School Diploma").'),
  skills: z.array(z.string()).describe('A list of skills the student possesses (e.g., "Python", "Data Analysis", "Project Management").'),
  interests: z.array(z.string()).describe('A list of interests the student has (e.g., "Artificial Intelligence", "Web Development", "Entrepreneurship").'),
  careerGoal: z.string().describe('The student\u0027s ultimate career aspiration (e.g., "Become a Senior AI Engineer", "Work in tech leadership").'),
});
export type GenerateCareerReportInput = z.infer<typeof GenerateCareerReportInputSchema>;

const GenerateCareerReportOutputSchema = z.object({
  careerSuggestions: z.array(z.string()).describe('A list of career paths suggested based on the student\u0027s profile.'),
  topJobRoles: z.array(z.string()).describe('A list of specific top job roles relevant to the suggested career paths.'),
  careerMatchPercentage: z.number().int().min(0).max(100).describe('A percentage indicating how well the student\u0027s profile matches the suggested careers.'),
  skillGapAnalysis: z.object({
    currentSkills: z.array(z.string()).describe('The skills the student currently possesses.'),
    missingSkills: z.array(z.string()).describe('Key skills identified as missing for the suggested career paths.'),
    improvementSuggestions: z.array(z.string()).describe('Actionable suggestions to acquire or improve the missing skills.'),
  }).describe('An analysis of the student\u0027s current skills versus the required skills for suggested careers.'),
  recommendedCertifications: z.array(z.string()).describe('A list of recommended certifications that would enhance the student\u0027s career prospects.'),
  learningRoadmap: z.array(z.object({
    month: z.string().describe('The month in the learning roadmap (e.g., "Month 1", "Month 2").'),
    activities: z.array(z.string()).describe('Key activities and learning objectives for this month.'),
  })).describe('A structured, month-by-month learning roadmap to achieve career goals.'),
  futureOpportunities: z.array(z.string()).describe('Potential future opportunities and trends within the suggested career fields.'),
  resumeTips: z.array(z.string()).describe('Actionable tips for improving the student\u0027s resume to target the suggested roles.'),
});
export type GenerateCareerReportOutput = z.infer<typeof GenerateCareerReportOutputSchema>;

const careerReportPrompt = ai.definePrompt({
  name: 'careerReportPrompt',
  input: {schema: GenerateCareerReportInputSchema},
  output: {schema: GenerateCareerReportOutputSchema},
  prompt: `You are an expert AI Career Advisor designed to help students discover suitable careers.\nGenerate a comprehensive career report for the student based on their provided details.\nEnsure the report is structured according to the specified JSON schema.\n\nStudent Details:\nFull Name: {{{fullName}}}\nEducation Background: {{{educationBackground}}}\nSkills: {{#each skills}}- {{{this}}}\n{{/each}}\nInterests: {{#each interests}}- {{{this}}}\n{{/each}}\nCareer Goal: {{{careerGoal}}}\n\nBased on this information, provide the following sections in your output:\n\n1. Career Suggestions: List 3-5 high-fit career paths.\n2. Top Job Roles: For each suggested career path, list 2-3 specific job roles.\n3. Career Match Percentage: Provide a single integer percentage (0-100) representing the overall match.\n4. Skill Gap Analysis:\n   - Current Skills: Reiterate the skills provided by the student.\n   - Missing Skills: Identify 3-5 crucial skills missing for the suggested career paths.\n   - Improvement Suggestions: For each missing skill, suggest a concrete action (e.g., "Take an online course on X", "Practice Y on Z platform").\n5. Recommended Certifications: Suggest 2-3 valuable certifications.\n6. Learning Roadmap: Provide a 6-month learning roadmap. Each month should have 2-4 specific activities.\n7. Future Opportunities: Describe 2-3 emerging trends or advanced roles within the suggested fields.\n8. Resume Tips: Offer 3-5 concise, actionable tips to optimize the student\u0027s resume for these careers.\n\nPlease ensure the output is a valid JSON object matching the GenerateCareerReportOutputSchema.\n`
});

const generateCareerReportFlow = ai.defineFlow(
  {
    name: 'generateCareerReportFlow',
    inputSchema: GenerateCareerReportInputSchema,
    outputSchema: GenerateCareerReportOutputSchema,
  },
  async (input) => {
    const {output} = await careerReportPrompt(input);
    if (!output) {
      throw new Error('Failed to generate career report output.');
    }
    return output;
  }
);

export async function generateCareerReport(input: GenerateCareerReportInput): Promise<GenerateCareerReportOutput> {
  return generateCareerReportFlow(input);
}
