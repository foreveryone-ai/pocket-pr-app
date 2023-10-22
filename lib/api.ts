export async function getChannelOnboarding() {
  try {
    const res = await fetch("/api/onboarding/channelid", {
      method: "GET",
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getVideoOnboarding() {
  try {
    const res = await fetch("/api/onboarding/latest-videos", {
      method: "GET",
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getCaptionsOnboarding() {
  try {
    const res = await fetch("/api/onboarding/captions", {
      method: "GET",
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrCreateCaptionSummary(videoid: string) {
  try {
    const res = await fetch("/api/analysis/captions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoid }),
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getChannelId() {
  try {
    const res = await fetch("/api/analysis/channel-id", {
      method: "GET",
    });
    const data = await res.json();
    console.log("getChannelId data:", data); // Add console log here
    return data.channelId;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrCreateAllCaptionSummary(channelid: string) {
  try {
    const res = await fetch("/api/analysis/all-captions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelid }),
    });
    console.log("Response status:", res.status); // Add console log here
    const data = await res.json();
    console.log("Response data:", data); // Add console log here
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllComments(videoid: string) {
  try {
    const res = await fetch("/api/analysis/comments-and-replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoid }),
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrCreateEmbeddings(videoid: string) {
  try {
    const res = await fetch("/api/analysis/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoid }),
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrCreateChatHistory(videoid: string) {
  try {
    const res = await fetch("/api/chat/create-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoid }),
    });
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
  }
}
