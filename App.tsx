import React, { useState, useEffect } from "react";
import { LoaderScreen } from "./components/LoaderScreen";
import { DayGlowScreen } from "./components/DayGlowScreen";
import { ScreenTimeReflector } from "./components/ScreenTimeReflector";
import { GratitudeFlipbook } from "./components/GratitudeFlipbook";
import { BreatheTimer } from "./components/BreatheTimer";
import { MemoryCapsule } from "./components/MemoryCapsule";
import { AboutPage } from "./components/AboutPage";
import { Navigation } from "./components/Navigation";

export type FamilyMember = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export type MoodEntry = {
  id: string;
  memberId: string;
  emoji: string;
  color: string;
  note?: string;
  date: string;
};

export type ReflectionEntry = {
  id: string;
  memberId: string;
  prompt: string;
  response: string;
  date: string;
};

export type GratitudeEntry = {
  id: string;
  memberId: string;
  text: string;
  date: string;
};

export type AppData = {
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  reflectionEntries: ReflectionEntry[];
  gratitudeEntries: GratitudeEntry[];
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("loader");
  const [appData, setAppData] = useState<AppData>({
    familyMembers: [],
    moodEntries: [],
    reflectionEntries: [],
    gratitudeEntries: [],
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("familyFlowData");
    if (savedData) {
      setAppData(JSON.parse(savedData));
    } else {
      // Initialize with sample family members - up to 6 with graphic icons
      const initialData: AppData = {
        familyMembers: [
          {
            id: "1",
            name: "Mom",
            avatar: "mother",
            color: "#FFE5E5",
          },
          {
            id: "2",
            name: "Dad", 
            avatar: "father",
            color: "#E5F3FF",
          },
          {
            id: "3",
            name: "Alex",
            avatar: "child",
            color: "#FFF5E5",
          },
          {
            id: "4",
            name: "Elisa",
            avatar: "child2", 
            color: "#E5FFE5",
          },
        ],
        moodEntries: [],
        reflectionEntries: [],
        gratitudeEntries: [],
      };
      setAppData(initialData);
      localStorage.setItem(
        "familyFlowData",
        JSON.stringify(initialData),
      );
    }

    // Auto-navigate from loader after 2 seconds
    const timer = setTimeout(() => {
      if (currentScreen === "loader") {
        setCurrentScreen("day-glow");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const updateAppData = (newData: Partial<AppData>) => {
    const updatedData = { ...appData, ...newData };
    setAppData(updatedData);
    localStorage.setItem(
      "familyFlowData",
      JSON.stringify(updatedData),
    );
  };

  const addFamilyMember = (member: Omit<FamilyMember, "id">) => {
    if (appData.familyMembers.length >= 6) return false;
    
    const newMember = { 
      ...member, 
      id: Date.now().toString() 
    };
    updateAppData({
      familyMembers: [...appData.familyMembers, newMember],
    });
    return true;
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    const updatedMembers = appData.familyMembers.map(member =>
      member.id === id ? { ...member, ...updates } : member
    );
    updateAppData({
      familyMembers: updatedMembers,
    });
  };

  const deleteFamilyMember = (id: string) => {
    // Don't allow deletion if only one member remains
    if (appData.familyMembers.length <= 1) return false;
    
    const updatedMembers = appData.familyMembers.filter(member => member.id !== id);
    
    // Also remove all entries for this member
    const updatedMoodEntries = appData.moodEntries.filter(entry => entry.memberId !== id);
    const updatedReflectionEntries = appData.reflectionEntries.filter(entry => entry.memberId !== id);
    const updatedGratitudeEntries = appData.gratitudeEntries.filter(entry => entry.memberId !== id);
    
    updateAppData({
      familyMembers: updatedMembers,
      moodEntries: updatedMoodEntries,
      reflectionEntries: updatedReflectionEntries,
      gratitudeEntries: updatedGratitudeEntries,
    });
    return true;
  };

  const addMoodEntry = (entry: Omit<MoodEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    updateAppData({
      moodEntries: [...appData.moodEntries, newEntry],
    });
  };

  const addReflectionEntry = (
    entry: Omit<ReflectionEntry, "id">,
  ) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    updateAppData({
      reflectionEntries: [
        ...appData.reflectionEntries,
        newEntry,
      ],
    });
  };

  const addGratitudeEntry = (
    entry: Omit<GratitudeEntry, "id">,
  ) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    updateAppData({
      gratitudeEntries: [...appData.gratitudeEntries, newEntry],
    });
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "loader":
        return <LoaderScreen />;
      case "day-glow":
        return (
          <DayGlowScreen
            familyMembers={appData.familyMembers}
            moodEntries={appData.moodEntries}
            onAddMoodEntry={addMoodEntry}
            onAddFamilyMember={addFamilyMember}
            onUpdateFamilyMember={updateFamilyMember}
            onDeleteFamilyMember={deleteFamilyMember}
          />
        );
      case "screen-time":
        return (
          <ScreenTimeReflector
            familyMembers={appData.familyMembers}
            reflectionEntries={appData.reflectionEntries}
            onAddReflectionEntry={addReflectionEntry}
          />
        );
      case "gratitude":
        return (
          <GratitudeFlipbook
            familyMembers={appData.familyMembers}
            gratitudeEntries={appData.gratitudeEntries}
            onAddGratitudeEntry={addGratitudeEntry}
          />
        );
      case "breathe":
        return <BreatheTimer />;
      case "memory":
        return (
          <MemoryCapsule 
            appData={appData} 
            onNavigate={setCurrentScreen}
            deferredPrompt={deferredPrompt}
            setDeferredPrompt={setDeferredPrompt}
          />
        );
      case "about":
        return (
          <AboutPage onNavigate={setCurrentScreen} />
        );
      default:
        return (
          <DayGlowScreen
            familyMembers={appData.familyMembers}
            moodEntries={appData.moodEntries}
            onAddMoodEntry={addMoodEntry}
            onAddFamilyMember={addFamilyMember}
            onUpdateFamilyMember={updateFamilyMember}
            onDeleteFamilyMember={deleteFamilyMember}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-lg z-50">
          📶 You're offline - Your data is saved locally
        </div>
      )}

      {renderCurrentScreen()}
      {currentScreen !== "loader" && currentScreen !== "about" && (
        <Navigation
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}