import { useState, useEffect } from "react";
import { LoaderScreen } from "./components/LoaderScreen";
import { DayGlowScreen } from "./components/DayGlowScreen";
import { DayEntriesView } from "./components/DayEntriesView";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appData, setAppData] = useState<AppData>({
    familyMembers: [],
    moodEntries: [],
    reflectionEntries: [],
    gratitudeEntries: [],
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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
            name: "Elisa",
            avatar: "child", 
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
    const handleBeforeInstallPrompt = (e: any) => {
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

  const deleteMoodEntry = (id: string) => {
    updateAppData({
      moodEntries: appData.moodEntries.filter(entry => entry.id !== id),
    });
  };

  const deleteReflectionEntry = (id: string) => {
    updateAppData({
      reflectionEntries: appData.reflectionEntries.filter(entry => entry.id !== id),
    });
  };

  const deleteGratitudeEntry = (id: string) => {
    updateAppData({
      gratitudeEntries: appData.gratitudeEntries.filter(entry => entry.id !== id),
    });
  };

  // Streak tracking helper functions
  const getStreakData = () => {
    const allEntries = [
      ...appData.moodEntries,
      ...appData.reflectionEntries,
      ...appData.gratitudeEntries
    ];

    // Get unique dates with any family activity
    const activityDates = new Set(
      allEntries.map(entry => new Date(entry.date).toDateString())
    );

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (activityDates.has(checkDate.toDateString())) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      totalActiveDays: activityDates.size,
      activityDates: Array.from(activityDates)
    };
  };

  const getDayActivityLevel = (date: Date) => {
    const dateString = date.toDateString();
    const dayEntries = [
      ...appData.moodEntries.filter(e => new Date(e.date).toDateString() === dateString),
      ...appData.reflectionEntries.filter(e => new Date(e.date).toDateString() === dateString),
      ...appData.gratitudeEntries.filter(e => new Date(e.date).toDateString() === dateString)
    ];

    if (dayEntries.length === 0) return 'none';
    if (dayEntries.length >= 3) return 'high';
    if (dayEntries.length >= 2) return 'medium';
    return 'low';
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentScreen("day-entries");
  };

  const handleBackToDayGlow = () => {
    setSelectedDate(null);
    setCurrentScreen("day-glow");
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
            getStreakData={getStreakData}
            getDayActivityLevel={getDayActivityLevel}
            onDaySelect={handleDaySelect}
          />
        );
      case "day-entries":
        return selectedDate ? (
          <DayEntriesView
            selectedDate={selectedDate}
            familyMembers={appData.familyMembers}
            moodEntries={appData.moodEntries}
            reflectionEntries={appData.reflectionEntries}
            gratitudeEntries={appData.gratitudeEntries}
            onDeleteMoodEntry={deleteMoodEntry}
            onDeleteReflectionEntry={deleteReflectionEntry}
            onDeleteGratitudeEntry={deleteGratitudeEntry}
            onNavigateBack={handleBackToDayGlow}
          />
        ) : (
          <DayGlowScreen
            familyMembers={appData.familyMembers}
            moodEntries={appData.moodEntries}
            onAddMoodEntry={addMoodEntry}
            onAddFamilyMember={addFamilyMember}
            onUpdateFamilyMember={updateFamilyMember}
            onDeleteFamilyMember={deleteFamilyMember}
            getStreakData={getStreakData}
            getDayActivityLevel={getDayActivityLevel}
            onDaySelect={handleDaySelect}
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
            getStreakData={getStreakData}
            getDayActivityLevel={getDayActivityLevel}
            onDaySelect={handleDaySelect}
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