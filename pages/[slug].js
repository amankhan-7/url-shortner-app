
import UrlModel from "./../backend/models/url";
import { connectDB } from "@/backend/lib/db";

export async function getServerSideProps({ params }) {
  
  await connectDB();

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
