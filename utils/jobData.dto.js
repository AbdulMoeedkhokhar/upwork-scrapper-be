/**
 * Job Data DTO (Data Transfer Object)
 * Transforms job data to only include specific fields
 */

/**
 * Transform a single job data document to DTO format
 * Extracts only the required fields from nested structure
 * @param {Object} jobData - MongoDB document
 * @returns {Object} Only the required fields
 */
export const jobDataDTO = (jobData) => {
  if (!jobData || !jobData.data) return null;

  const data = jobData.data;
  const jobDetails = data?.jobDetails?.jobDetails;
  const opening = jobDetails?.opening?.job;
  const buyer = jobDetails?.buyer?.info;

  // Extract only the required fields
  return {
    jobId: data?.jobId || null,
    title: opening?.info?.title || null,
    amount: opening?.budget?.amount || null,
    categoryName: opening?.category?.name || null,
    buyerName: buyer?.company?.name || null,
    companyId: buyer?.company?.id || null,
    companySummary: buyer?.company?.summary || null,
    companyWebsite: buyer?.company?.url || null,
    companySize: buyer?.company?.profile?.size || null,
    industry: buyer?.company?.profile?.industry || null,
    country: buyer?.location?.country || null,
    city: buyer?.location?.city || null,
    logo: buyer?.logo || null,
  };
};

/**
 * Transform multiple job data documents to DTO format
 * @param {Array} jobDataArray - Array of MongoDB documents
 * @returns {Array} Array of DTO objects
 */
export const jobDataListDTO = (jobDataArray) => {
  if (!Array.isArray(jobDataArray)) return [];
  
  return jobDataArray.map(jobData => jobDataDTO(jobData));
};

