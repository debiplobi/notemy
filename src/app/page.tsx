import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: true,
});

export default function Page() {
  return <Dashboard />;
}
