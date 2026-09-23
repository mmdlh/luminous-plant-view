import { createFileRoute } from "@tanstack/react-router";
import { FactoryDashboard } from "../components/factory-dashboard";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "综合态势感知中心 — 擎云智造" },
    { name: "description", content: "汇聚生产、设备、质量、能源与物流数据的智慧工厂综合态势平台。" },
    { property: "og:title", content: "擎云智造智慧工厂平台" },
    { property: "og:description", content: "全域实时数据驱动的智慧工厂综合态势感知中心。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <FactoryDashboard page="overview" />;
}
