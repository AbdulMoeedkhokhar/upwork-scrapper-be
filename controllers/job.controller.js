/**
 * Get job details using jobId and Upwork token
 */
export const getJobDetails = async (req, res) => {
  try {
    const { jobId, upworkToken } = req.body;

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!upworkToken) {
      return res.status(400).json({
        success: false,
        message: "Upwork token is required",
      });
    }

    // TODO: Use jobId and upworkToken to fetch job details from Upwork API
    const fetchData = async (url, authToken) => {
      // try {
      const response = await fetch(url, {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "authorization": `Bearer ${authToken}`,
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-viewport-width": "1440",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "vnd-eo-parent-span-id": "71e42d87-db5a-483d-8f60-a2864bc34ad7",
          "vnd-eo-span-id": "0fceedd3-4921-4377-9304-5ec338a796b4",
          "vnd-eo-trace-id": "5e409ab1-2067-414e-9da5-81cf010ccb67",
          "x-odesk-user-agent": "oDesk LM",
          "x-requested-with": "XMLHttpRequest",
          "x-upwork-accept-language": "en-US"
        },
        "referrer": `https://www.upwork.com/ab/proposals/job/~${newJobId}/apply/`,
        "referrerPolicy": "origin-when-cross-origin",
        "method": "GET",
        "mode": "cors",
        "credentials": "include",
      });
      if (response.ok) {
        return await response.json();
      }
      throw JSON.stringify({ code: response.status, message: await response.text() })
    };


    const jobDetailsV4Url = `https://www.upwork.com/ab/proposals/api/v4/job/details/${jobId}`;




    // For now, just return "Hi" as requested
    res.status(200).json({
      success: true,
      message: "Hi",
      data: {
        jobId,
        // upworkToken is not returned for security reasons
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching job details",
    });
  }
};

