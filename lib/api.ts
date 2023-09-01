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
