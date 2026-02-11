
import UrlModel from "./../backend/models/url";

export async function getServerSideProps({ params }) {
  console.log("Slug page hit with params:", params);

  const { slug } = params;

  const entry = await UrlModel.findOneAndUpdate(
    { shortId: slug },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!entry) {
    console.log("ShortId not found in DB:", slug);
    return { notFound: true };
  }

  console.log("Redirecting to:", entry.redirectURL);

  return {
    redirect: {
      destination: entry.redirectURL.startsWith("http")
        ? entry.redirectURL
        : "https://" + entry.redirectURL,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return null;
}
