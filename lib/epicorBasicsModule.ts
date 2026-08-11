import type { Module } from "./curriculum";

const BASE = "https://bcrovxnarohytinnqkrp.supabase.co/storage/v1/object/public/KineticUI/";

export const epicorBasicsModule = {
  slug: "epicor-basics",
  title: "Kinetic Basics: Login & Navigation",
  tagline: "Start here — before touching Application Studio, know how to log in and find your way around Kinetic",
  icon: "🔑",
  estMinutes: 12,
  difficulty: "Foundational",
  lessons: [
    {
      id: "login-client-vs-browser",
      title: "Logging Into Kinetic",
      minutes: 5,
      body: [
        "Kinetic runs entirely in your **web browser** — there's nothing to install. Your administrator gives you a Kinetic URL; open it, and you'll land on the sign-in screen.",
        "Enter your **Username** and **Password** and select **Log In**. Depending on how your organization has things configured, you may be logged in automatically via **Single Sign-On (SSO)** using your existing corporate credentials instead of a separate Epicor password.",
        "If your account has access to more than one **Company** or **Site**, you'll be prompted to pick one after signing in — this determines which data and menu items you see for the rest of your session. You can typically switch companies later from the User Panel without logging out.",
        "Application Studio, the subject of the rest of this course, is a Kinetic web feature — everything you'll learn here works the same way regardless of which company or site you're logged into."
      ],
      images: [
        { url: `${BASE}LoginScreen.png`, caption: "The Kinetic sign-in screen." },
      ],
      proTip: "Bookmark your Kinetic URL — most organizations don't publish it anywhere obvious, so save it the first time IT gives it to you.",
      version: "both",
    },
    {
      id: "home-navigation",
      title: "Home Page & Navigation",
      minutes: 7,
      body: [
        "The **Home button** always brings you back to your personalized home dashboard, which can include widgets, panels, and notifications tailored to your role.",
        "**Enterprise Search** (sometimes just called Search) is Kinetic's fast lookup — type a customer, part number, or even a screen name, and matching records or programs show up instantly, no menu digging required.",
        "The **Menu** icon opens the left-hand navigation panel with three tabs: the full **Main Menu** tree (organized the same way Classic menus were — module → sub-module → program), **Favorites** (screens you've pinned for quick access), and **Recent** (a running history of what you've opened most recently).",
        "The **User Panel** is where you switch **Company**, **Site/Plant**, or **Workstation**, and manage account settings — these fields can generally only be changed from the Home screen, not from inside an open program.",
        "**Help & Support** sits at the bottom of the navigation rail and includes guided, click-through tours of the Home Page and other core screens — genuinely useful if you're brand new to the interface.",
        "A small **connection info** indicator (visible near the User Panel) shows which database/environment and company you're currently connected to — always worth a glance before making changes, especially if your organization has multiple companies or test vs. production environments."
      ],
      images: [
        { url: `${BASE}HomePage.png`, caption: "The Kinetic home dashboard." },
        { url: `${BASE}MainMenu.png`, caption: "The Main Menu navigation panel." },
      ],
      proTip: "Pin anything you open more than a couple of times a week to Favorites — it's almost always faster than the Main Menu tree or even Search.",
      version: "both",
    }
  ],
  quiz: [
    {
      id: "q1",
      question: "How do you access Kinetic?",
      options: [
        "Install a desktop client",
        "Open your Kinetic URL in a web browser",
        "Download a mobile-only app",
        "Connect via FTP"
      ],
      correctIndex: 1,
      explanation: "Kinetic is a browser-based experience — there's nothing to install locally.",
    },
    {
      id: "q2",
      question: "What does Single Sign-On (SSO) change about logging in?",
      options: [
        "It requires a separate Epicor-specific password every time",
        "It logs you in automatically using your existing corporate credentials",
        "It disables Application Studio",
        "It requires a hardware security key"
      ],
      correctIndex: 1,
      explanation: "SSO uses your existing corporate identity to log you in, without a separate Epicor password.",
    },
    {
      id: "q3",
      question: "Where do you switch Company or Site after logging in?",
      options: ["Inside any open program", "The User Panel on the Home screen", "The browser address bar", "You cannot switch without logging out"],
      correctIndex: 1,
      explanation: "Company/Site/Workstation switches happen through the User Panel, generally only from the Home screen.",
    },
    {
      id: "q4",
      question: "Which navigation panel tab shows a running history of recently opened screens?",
      options: ["Favorites", "Recent", "Main Menu", "Help & Support"],
      correctIndex: 1,
      explanation: "Recent tracks recently visited screens; Favorites is for manually pinned items.",
    },
    {
      id: "q5",
      question: "What's the fastest way to open a screen if you already know its name?",
      options: [
        "Drill through the full Main Menu tree every time",
        "Use Enterprise Search and type the screen name",
        "Log out and back in",
        "Ask an administrator to add it to Favorites for you"
      ],
      correctIndex: 1,
      explanation: "Enterprise Search is almost always faster than navigating the menu tree manually.",
    },
  ],
} as Module;
