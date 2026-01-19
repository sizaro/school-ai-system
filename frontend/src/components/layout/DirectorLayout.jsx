import { Routes, Route } from "react-router-dom";
import DirectorSidebar from "../sidebars/DirectorSidebar.jsx";

// Pages
import DirectorDashboard from "../../pages/director/DirectorDashboard.jsx";
import SchoolOverview from "../../pages/director/SchoolOverview.jsx";
import StaffManagement from "../../pages/director/StaffManagement.jsx";

const DirectorLayout = () => {
  return (
    <>
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Director Medanfo Africa Community School</title>

    <link rel="icon" href="/images/medanfo log.jpeg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

    <meta
      name="description"
      content="Medanfo Africa Community School provides quality education, community-driven learning, and holistic development for students in Africa."
    />
    <meta
      name="keywords"
      content="Medanfo School, Africa Community School, Education Africa, Primary School, Secondary School"
    />
    <meta name="author" content="Medanfo Africa Community School" />
    <meta name="robots" content="index, follow" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Medanfo Africa Community School" />
    <meta
      property="og:description"
      content="A community-focused school offering quality education and holistic growth for learners in Africa."
    />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:url" content="https://www.medanfoafricaschool.com" />
    <meta property="og:site_name" content="Medanfo Africa Community School" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Medanfo Africa Community School" />
    <meta
      name="twitter:description"
      content="Empowering learners through quality education and strong community values."
    />
    <meta name="twitter:image" content="/og-image.png" />


    <meta name="theme-color" content="#1e40af" />

  </head>

    <div className="flex h-screen bg-gray-100">
      <DirectorSidebar />
      <main className="flex-1 p-6 overflow-y-auto w-full mt-18 ml-[-10px] md:ml-64 md:mt-6">
        <Routes>
          <Route index element={<DirectorDashboard />} />
          <Route path="dashboard" element={<DirectorDashboard />} />
          <Route path="overview" element={<SchoolOverview />} />
          <Route path="staff" element={<StaffManagement />} />
        </Routes>
      </main>
    </div>
    </>
    
    
    
  );
};

export default DirectorLayout;
