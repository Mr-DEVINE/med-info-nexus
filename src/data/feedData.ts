
export interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  category: string;
  type: string;
}

export const posts: Post[] = [
  {
    id: "1",
    author: {
      name: "Dr. Sarah Johnson",
      role: "doctor",
    },
    date: "April 1, 2025",
    title: "New Findings on Cardiovascular Disease Prevention",
    content: "Recent research indicates that a combination of lifestyle modifications and targeted pharmacological interventions can significantly reduce cardiovascular risk factors in high-risk populations. Our team has identified several biomarkers that may help in early detection.",
    image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    likes: 145,
    comments: 23,
    category: "research",
    type: "doctor"
  },
  {
    id: "2",
    author: {
      name: "Prof. Michael Chen",
      role: "researcher",
    },
    date: "March 30, 2025",
    title: "Breakthrough in Alzheimer's Research",
    content: "Our research team has discovered a novel protein that appears to play a significant role in the development of Alzheimer's disease. This finding opens new avenues for therapeutic interventions that could potentially slow down or halt the progression of the disease.",
    likes: 278,
    comments: 42,
    category: "research",
    type: "researcher"
  },
  {
    id: "3",
    author: {
      name: "National Blood Services",
      role: "bloodbank",
    },
    date: "March 28, 2025",
    title: "Improved Storage Techniques for Rare Blood Types",
    content: "We've implemented a new preservation method that extends the viability of rare blood types by up to 30%. This breakthrough will significantly improve accessibility for patients with rare blood groups requiring transfusions.",
    image: "https://images.unsplash.com/photo-1615461066839-6c16ebd61a1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    likes: 92,
    comments: 15,
    category: "bloodbank",
    type: "bloodbank"
  },
  {
    id: "4",
    author: {
      name: "MediPharm Labs",
      role: "pharmaceutical",
    },
    date: "March 25, 2025",
    title: "New Drug Development for Treatment-Resistant Depression",
    content: "We're pleased to announce the successful Phase II clinical trials of our new compound for treatment-resistant depression. The results show a 65% response rate with minimal side effects compared to existing treatments.",
    likes: 183,
    comments: 31,
    category: "pharmaceutical",
    type: "pharmaceutical"
  },
  {
    id: "5",
    author: {
      name: "Dr. Amanda Rodriguez",
      role: "doctor",
    },
    date: "March 22, 2025",
    title: "Latest Techniques in Minimally Invasive Surgery",
    content: "I've recently incorporated robotics-assisted techniques in my practice for complex abdominal surgeries. The precision offered by these systems has resulted in better outcomes and significantly shorter recovery times for patients.",
    likes: 127,
    comments: 19,
    category: "clinical",
    type: "doctor"
  },
  {
    id: "6",
    author: {
      name: "Global Health Research Institute",
      role: "researcher",
    },
    date: "March 20, 2025",
    title: "Epidemiological Patterns in Post-Pandemic Health",
    content: "Our five-year longitudinal study reveals interesting trends in post-pandemic health metrics. We've observed unexpected changes in respiratory disease patterns and immune responses in populations across different geographic regions.",
    image: "https://images.unsplash.com/photo-1576671414121-aa2d0967199c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    likes: 205,
    comments: 37,
    category: "research",
    type: "researcher"
  },
  {
    id: "7",
    author: {
      name: "CityWide Blood Alliance",
      role: "bloodbank",
    },
    date: "March 18, 2025",
    title: "Urgent Appeal: Rare AB Negative Blood Required",
    content: "We're currently experiencing a critical shortage of AB negative blood type. If you are an AB negative donor, please consider donating as soon as possible. Your donation could save multiple lives in emergency trauma cases.",
    likes: 63,
    comments: 7,
    category: "bloodbank",
    type: "bloodbank"
  },
  {
    id: "8",
    author: {
      name: "NovaLife Pharmaceuticals",
      role: "pharmaceutical",
    },
    date: "March 15, 2025",
    title: "Advancements in Personalized Cancer Treatments",
    content: "Our latest line of cancer therapeutics utilizes genetic profiling to tailor treatments to individual patients. Early results show up to 40% better response rates compared to standard protocols in certain cancer types.",
    likes: 231,
    comments: 29,
    category: "pharmaceutical",
    type: "pharmaceutical"
  }
];
