import type { Module } from "./curriculum";

export const epicorBasicsModule: Module = {
  slug: "epicor-basics",
  title: "Epicor Basics: Login & Navigation",
  tagline: "Start here — before touching Application Studio, know how to log in and find your way around",
  icon: "🔑",
  estMinutes: 15,
  difficulty: "Foundational",
  lessons: [
    {
      id: "login-client-vs-browser",
      title: "Logging Into Epicor: Client vs. Browser",
      minutes: 6,
      body: [
        "Kinetic can be accessed two ways: the **Browser (Kinetic Web Access)** — a modern, responsive experience running entirely in your web browser at your company's Kinetic URL — and the **Smart Client / Classic desktop client** — an installed Windows application still used for some Classic-only screens and administrative tools.",
        "The browser login screen asks for **Server URL**, **Company**, **User ID**, and **Password**. Some environments layer **Single Sign-On (SSO)** on top, in which case your corporate credentials log you in automatically without a separate Epicor password.",
        "Application Studio, the subject of the rest of this course, lives entirely in the **Kinetic Browser experience** — it does not exist in the old Classic client. If your organization is still primarily on Classic, Application Studio is one of the best reasons to push toward full Kinetic adoption.",
        "After logging in, you may be prompted to select a **Company** and **Plant** if your account has access to more than one — this scopes which data and menu items you see for the rest of your session."
      ],
      proTip: "If you can't find Application Studio at all, you're probably still in the Classic/Smart Client — switch to the Kinetic Browser URL instead.",
      version: "both",
    },
    {
      id: "home-navigation",
      title: "Kinetic Home Page & Navigation",
      minutes: 9,
      body: [
        "The left-hand icon rail is your main navigation: **Home**, **Search** (global record/menu search), **Apps** (grid of all available application tiles), **Favorites** (pinned menu items), **History** (recently visited screens), **Analytics/BAQ**, **More** (overflow), **Help**, **Notifications**, and your **Profile/user menu** at the bottom.",
        "The top bar typically shows your current **Company**, **User**, **Plant**, and any active **Environment** indicators — always double-check these before making changes, especially in multi-company setups.",
        "The **Main Menu** is a searchable, expandable tree (Sales Management → Order Management → General Operations → Order Entry, for example) mirroring how Classic menus were organized, so if you know the old menu path you can usually find the same screen in Kinetic.",
        "**Favorites** and **History** exist specifically to cut down on menu-tree navigation for the screens you use daily — pin anything you open more than a couple of times a week."
      ],
      proTip: "Use the global Search icon and just start typing a screen name (e.g. 'Customer Entry') — it's almost always faster than drilling through the menu tree.",
      version: "both",
    }
  ],
  quiz: [
    {
      id: "q1",
      question: "Where does Application Studio live?",
      options: [
        "Only in the Classic/Smart Client",
        "Only in the Kinetic Browser experience",
        "Equally in both Classic and Kinetic",
        "In a separate standalone app"
      ],
      correctIndex: 1,
      explanation: "Application Studio is a Kinetic Browser-only feature — it doesn't exist in the Classic/Smart Client.",
    },
    {
      id: "q2",
      question: "What four fields does the standard Kinetic browser login screen ask for?",
      options: [
        "Username, Password, Email, Phone",
        "Server URL, Company, User ID, Password",
        "Domain, Plant, Role, PIN",
        "Company, Plant, Environment, Token"
      ],
      correctIndex: 1,
      explanation: "The login screen asks for Server URL, Company, User ID, and Password (unless SSO bypasses this).",
    },
    {
      id: "q3",
      question: "What does Single Sign-On (SSO) change about logging in?",
      options: [
        "It requires a separate Epicor-specific password every time",
        "It logs you in automatically using your corporate credentials",
        "It disables Application Studio",
        "It only works in the Classic client"
      ],
      correctIndex: 1,
      explanation: "SSO uses your existing corporate identity to log you in, without a separate Epicor password.",
    },
    {
      id: "q4",
      question: "Which icon rail item shows recently visited screens?",
      options: ["Favorites", "History", "Search", "Analytics"],
      correctIndex: 1,
      explanation: "History tracks recently visited screens; Favorites is for manually pinned items.",
    },
    {
      id: "q5",
      question: "What's the fastest way to open a screen if you already know its name?",
      options: [
        "Drill through the full Main Menu tree every time",
        "Use the global Search icon and type the screen name",
        "Log out and back in",
        "Ask an administrator to add it to Favorites for you"
      ],
      correctIndex: 1,
      explanation: "Global Search is almost always faster than navigating the menu tree manually.",
    },
  ],
};
