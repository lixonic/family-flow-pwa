import { useState, useEffect } from "react";
import { WelcomeCards } from "./components/WelcomeCards";
import { DayGlowScreen } from "./components/DayGlowScreen";
import { DayEntriesView } from "./components/DayEntriesView";
import { ScreenTimeReflector } from "./components/ScreenTimeReflector";
import { GratitudeFlipbook } from "./components/GratitudeFlipbook";
import { MemoryCapsule } from "./components/MemoryCapsule";
import { FamilySync } from "./components/FamilySync";
import { GuidePage } from "./components/GuidePage";
import { Navigation } from "./components/Navigation";
import { MilestoneCelebration } from "./components/MilestoneCelebration";
import { TransitionPrompt } from "./components/TransitionPrompt";
import { ReadinessAssessment } from "./components/ReadinessAssessment";
import { GraduationView } from "./components/GraduationView";
// import { UpdateNotification } from "./components/UpdateNotification"; // Disabled: Updates now silent
import { useServiceWorkerUpdate } from "./hooks/useServiceWorkerUpdate";
import { useAppStorage } from "./hooks/useAppStorage";

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

export type GraduationMilestone = {
  id: string;
  type: 'check-ins' | 'streak' | 'completion';
  threshold: number;
  achieved: boolean;
  achievedDate?: string;
  title: string;
  description: string;
  celebrationShown: boolean;
};

export type GraduationSettings = {
  targetGraduationDays: number; // Default: 45 days
  showTransitionPrompts: boolean;
  preferredOfflineActivities: string[];
  readinessAssessmentCompleted: boolean;
  lastReadinessCheck?: string;
};

export type AppData = {
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  reflectionEntries: ReflectionEntry[];
  gratitudeEntries: GratitudeEntry[];
  graduationMilestones: GraduationMilestone[];
  graduationSettings: GraduationSettings;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("day-glow");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [appData, setAppData] = useState<AppData>({
    familyMembers: [],
    moodEntries: [],
    reflectionEntries: [],
    gratitudeEntries: [],
    graduationMilestones: [],
    graduationSettings: {
      targetGraduationDays: 45,
      showTransitionPrompts: true,
      preferredOfflineActivities: [],
      readinessAssessmentCompleted: false,
    },
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [activeMilestones, setActiveMilestones] = useState<GraduationMilestone[]>([]);
  const [currentTransitionPrompt, setCurrentTransitionPrompt] = useState<{type: string, title: string, message: string, actionText: string} | null>(null);
  const [showReadinessAssessment, setShowReadinessAssessment] = useState(false);
  
  // PWA Update handling
  useServiceWorkerUpdate(); // Silent updates - no UI needed
  
  // Storage handling (IndexedDB with localStorage fallback)
  const { isStorageReady, loadData, saveData, clearData, storageError, isLoading } = useAppStorage();

  // Load data from IndexedDB when storage is ready
  useEffect(() => {
    if (!isStorageReady) return;

    const loadFamilyData = async () => {
      try {
        const savedData = await loadData();
        
        if (savedData) {
          // Migrate existing data to include graduation system
          const migratedData: AppData = {
            ...savedData,
            graduationMilestones: savedData.graduationMilestones || [
              {
                id: "milestone-15-days",
                type: "check-ins" as const,
                threshold: 15,
                achieved: false,
                title: "15 Check-ins Completed - Building the Habit!",
                description: "Your family is establishing a regular connection rhythm.",
                celebrationShown: false,
              },
              {
                id: "milestone-30-days",
                type: "check-ins" as const,
                threshold: 30,
                achieved: false,
                title: "30 Check-ins Completed - Training Wheels Ready to Come Off!",
                description: "Amazing consistency! Your family is ready to explore more independent practices.",
                celebrationShown: false,
              },
              {
                id: "milestone-45-days",
                type: "check-ins" as const,
                threshold: 45,
                achieved: false,
                title: "45 Check-ins Completed - Graduation Time!",
                description: "Congratulations! Your family has built lasting connection habits and is ready to graduate to offline practices.",
                celebrationShown: false,
              },
            ],
            graduationSettings: savedData.graduationSettings || {
              targetGraduationDays: 45,
              showTransitionPrompts: true,
              preferredOfflineActivities: [],
              readinessAssessmentCompleted: false,
            },
          };
          
          setAppData(migratedData);
          
          // Only save if migration was needed (avoid unnecessary saves)
          if (!savedData.graduationMilestones || !savedData.graduationSettings) {
            // Save migrated data back to storage (async, non-blocking)
            saveData(migratedData).catch(error => 
              console.error('Failed to save migrated data:', error)
            );
          }
        } else {
          // Initialize with empty family - users will add their own members
          const initialData: AppData = {
            familyMembers: [],
            moodEntries: [],
            reflectionEntries: [],
            gratitudeEntries: [],
            graduationMilestones: [
              {
                id: "milestone-15-days",
                type: "check-ins",
                threshold: 15,
                achieved: false,
                title: "15 Check-ins Completed - Building the Habit!",
                description: "Your family is establishing a regular connection rhythm.",
                celebrationShown: false,
              },
              {
                id: "milestone-30-days",
                type: "check-ins",
                threshold: 30,
                achieved: false,
                title: "30 Check-ins Completed - Training Wheels Ready to Come Off!",
                description: "Amazing consistency! Your family is ready to explore more independent practices.",
                celebrationShown: false,
              },
              {
                id: "milestone-45-days",
                type: "check-ins",
                threshold: 45,
                achieved: false,
                title: "45 Check-ins Completed - Graduation Time!",
                description: "Congratulations! Your family has built lasting connection habits and is ready to graduate to offline practices.",
                celebrationShown: false,
              },
            ],
            graduationSettings: {
              targetGraduationDays: 45,
              showTransitionPrompts: true,
              preferredOfflineActivities: [],
              readinessAssessmentCompleted: false,
            },
          };
          setAppData(initialData);
          saveData(initialData).catch(error => 
            console.error('Failed to save initial data:', error)
          );
        }
      } catch (error) {
        console.error('Failed to load family data:', error);
      }
    };

    loadFamilyData();
  }, [isStorageReady]); // Remove loadData and saveData from dependencies to prevent unnecessary re-runs

  useEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Check if welcome should be shown
    const welcomeShown = localStorage.getItem('familyFlowWelcomeShown');
    
    // Show welcome for new users immediately
    if (!welcomeShown) {
      setShowWelcome(true);
    }

    // Ensure page starts at top
    window.scrollTo(0, 0);

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
    
    // Save to IndexedDB asynchronously (non-blocking)
    saveData(updatedData).catch(error => {
      console.error('Failed to save app data:', error);
      // Data is still updated in state, so app continues working
    });
  };

  const addFamilyMember = (member: Omit<FamilyMember, "id">) => {
    
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

  // Graduation Mechanics Functions
  const checkMilestoneProgress = () => {
    if (!appData.graduationMilestones) return [];
    
    const streakData = getStreakData();
    const totalCheckIns = streakData.totalActiveDays;

    const updatedMilestones = appData.graduationMilestones.map(milestone => {
      if (!milestone.achieved && totalCheckIns >= milestone.threshold) {
        return {
          ...milestone,
          achieved: true,
          achievedDate: new Date().toISOString(),
        };
      }
      return milestone;
    });

    if (JSON.stringify(updatedMilestones) !== JSON.stringify(appData.graduationMilestones)) {
      updateAppData({ graduationMilestones: updatedMilestones });
      return updatedMilestones.filter(m => m.achieved && !m.celebrationShown);
    }

    return [];
  };

  const markMilestoneCelebrationShown = (milestoneId: string) => {
    if (!appData.graduationMilestones) return;
    
    const updatedMilestones = appData.graduationMilestones.map(milestone =>
      milestone.id === milestoneId
        ? { ...milestone, celebrationShown: true }
        : milestone
    );
    updateAppData({ graduationMilestones: updatedMilestones });
  };

  const getGraduationProgress = () => {
    const streakData = getStreakData();
    const totalCheckIns = streakData.totalActiveDays;
    const targetDays = appData.graduationSettings?.targetGraduationDays || 45;
    const progressPercentage = Math.min((totalCheckIns / targetDays) * 100, 100);

    const nextMilestone = appData.graduationMilestones
      ?.filter(m => !m.achieved)
      .sort((a, b) => a.threshold - b.threshold)[0];

    const readyForGraduation = totalCheckIns >= targetDays;
    const nearGraduation = progressPercentage >= 75;

    return {
      totalCheckIns,
      targetDays,
      progressPercentage,
      nextMilestone,
      readyForGraduation,
      nearGraduation,
      achievedMilestones: appData.graduationMilestones?.filter(m => m.achieved) || [],
    };
  };

  const getTransitionPrompts = () => {
    const progress = getGraduationProgress();
    const prompts = [];

    if (progress.totalCheckIns >= 15 && progress.totalCheckIns < 30) {
      prompts.push({
        type: 'encourage-consistency',
        title: 'Building Strong Habits',
        message: 'Your family is developing a beautiful connection rhythm. Keep going!',
        actionText: 'Continue Building',
      });
    }

    if (progress.totalCheckIns >= 30 && progress.totalCheckIns < 45) {
      prompts.push({
        type: 'suggest-offline',
        title: 'Ready to Try Offline?',
        message: 'Your family is ready to try verbal check-ins without the app. Want to give it a shot?',
        actionText: 'Try Offline Mode',
      });
    }

    if (progress.readyForGraduation && !appData.graduationSettings?.readinessAssessmentCompleted) {
      prompts.push({
        type: 'graduation-ready',
        title: 'Graduation Time!',
        message: 'Congratulations! Your family has built lasting connection habits and is ready to graduate to independent practices.',
        actionText: 'Start Graduation',
      });
    }

    return prompts.filter(() => appData.graduationSettings?.showTransitionPrompts ?? true);
  };

  const updateGraduationSettings = (updates: Partial<GraduationSettings>) => {
    const currentSettings = appData.graduationSettings || {
      targetGraduationDays: 45,
      showTransitionPrompts: true,
      preferredOfflineActivities: [],
      readinessAssessmentCompleted: false,
    };
    
    updateAppData({
      graduationSettings: { ...currentSettings, ...updates }
    });
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentScreen("day-entries");
  };

  const handleBackToDayGlow = () => {
    setSelectedDate(null);
    setCurrentScreen("day-glow");
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setCurrentScreen("day-glow");
  };

  // Graduation UI Handlers
  const handleMilestoneCelebrationComplete = (milestoneId: string) => {
    markMilestoneCelebrationShown(milestoneId);
    setActiveMilestones(current => current.filter(m => m.id !== milestoneId));
  };

  const handleTransitionPromptAction = (action: string) => {
    switch (action) {
      case 'suggest-offline':
        // Could open a guide or tips screen
        setCurrentScreen("guide");
        break;
      case 'graduation-ready':
        setShowReadinessAssessment(true);
        break;
      case 'disable-prompts':
        updateGraduationSettings({ showTransitionPrompts: false });
        break;
    }
    setCurrentTransitionPrompt(null);
  };

  const handleTransitionPromptDismiss = () => {
    setCurrentTransitionPrompt(null);
  };

  const handleReadinessAssessmentComplete = (_score: number, recommendations: string[]) => {
    updateGraduationSettings({ 
      readinessAssessmentCompleted: true,
      lastReadinessCheck: new Date().toISOString(),
      preferredOfflineActivities: recommendations
    });
    setShowReadinessAssessment(false);
    // Could show results or navigate to a completion screen
  };

  const handleReadinessAssessmentCancel = () => {
    setShowReadinessAssessment(false);
  };

  const handleStartReadinessAssessment = () => {
    setShowReadinessAssessment(true);
  };

  const handleEraseAllData = async () => {
    try {
      // Clear all Family Flow data (IndexedDB and localStorage)
      await clearData();
      
      // Reset app data to initial state (empty family)
      const initialData: AppData = {
        familyMembers: [],
        moodEntries: [],
        reflectionEntries: [],
        gratitudeEntries: [],
        graduationMilestones: [
          {
            id: "milestone-15-days",
            type: "check-ins" as const,
            threshold: 15,
            achieved: false,
            title: "15 Check-ins Completed - Building the Habit!",
            description: "Your family is establishing a regular connection rhythm.",
            celebrationShown: false,
          },
          {
            id: "milestone-30-days",
            type: "check-ins" as const,
            threshold: 30,
            achieved: false,
            title: "30 Check-ins Completed - Training Wheels Ready to Come Off!",
            description: "Amazing consistency! Your family is ready to explore more independent practices.",
            celebrationShown: false,
          },
          {
            id: "milestone-45-days",
            type: "check-ins" as const,
            threshold: 45,
            achieved: false,
            title: "45 Check-ins Completed - Graduation Time!",
            description: "Congratulations! Your family has built lasting connection habits and is ready to graduate to offline practices.",
            celebrationShown: false,
          },
        ],
        graduationSettings: {
          targetGraduationDays: 45,
          showTransitionPrompts: true,
          preferredOfflineActivities: [],
          readinessAssessmentCompleted: false,
        },
      };
      
      setAppData(initialData);
      await saveData(initialData);
    } catch (error) {
      console.error('Failed to erase data:', error);
    }
    
    // Reset all UI state
    setActiveMilestones([]);
    setCurrentTransitionPrompt(null);
    setShowReadinessAssessment(false);
    setShowWelcome(false);
    setSelectedDate(null);
    
    // Navigate back to day-glow screen
    setCurrentScreen("day-glow");
  };

  const handleImportData = (importedData: Partial<AppData>) => {
    try {
      const newAppData = { ...appData };
      
      // Merge family members (avoid duplicates by name)
      if (importedData.familyMembers) {
        const existingNames = new Set(newAppData.familyMembers.map(m => m.name.toLowerCase()));
        const newMembers = importedData.familyMembers.filter(
          member => !existingNames.has(member.name.toLowerCase())
        );
        newAppData.familyMembers = [...newAppData.familyMembers, ...newMembers];
      }
      
      // Merge entries (avoid duplicates by ID)
      if (importedData.moodEntries) {
        const existingIds = new Set(newAppData.moodEntries.map(e => e.id));
        const newEntries = importedData.moodEntries.filter(entry => !existingIds.has(entry.id));
        newAppData.moodEntries = [...newAppData.moodEntries, ...newEntries];
      }
      
      if (importedData.reflectionEntries) {
        const existingIds = new Set(newAppData.reflectionEntries.map(e => e.id));
        const newEntries = importedData.reflectionEntries.filter(entry => !existingIds.has(entry.id));
        newAppData.reflectionEntries = [...newAppData.reflectionEntries, ...newEntries];
      }
      
      if (importedData.gratitudeEntries) {
        const existingIds = new Set(newAppData.gratitudeEntries.map(e => e.id));
        const newEntries = importedData.gratitudeEntries.filter(entry => !existingIds.has(entry.id));
        newAppData.gratitudeEntries = [...newAppData.gratitudeEntries, ...newEntries];
      }
      
      // Update graduation milestones if imported
      if (importedData.graduationMilestones) {
        const existingMilestoneIds = new Set(newAppData.graduationMilestones.map(m => m.id));
        const newMilestones = importedData.graduationMilestones.filter(
          milestone => !existingMilestoneIds.has(milestone.id)
        );
        newAppData.graduationMilestones = [...newAppData.graduationMilestones, ...newMilestones];
      }
      
      setAppData(newAppData);
      saveData(newAppData);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  // Check for milestone achievements and transition prompts
  useEffect(() => {
    const newMilestones = checkMilestoneProgress();
    if (newMilestones.length > 0) {
      setActiveMilestones(newMilestones);
    }

    // Check for transition prompts
    const prompts = getTransitionPrompts();
    if (prompts.length > 0 && !currentTransitionPrompt) {
      setCurrentTransitionPrompt(prompts[0]);
    }
  }, [appData.moodEntries, appData.reflectionEntries, appData.gratitudeEntries]);


  const renderCurrentScreen = () => {
    // Show loading state while data is being loaded
    if (isLoading || !isStorageReady) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
          <div className="text-center">
            <h1 className="font-title text-4xl font-medium mb-4 text-orange-600">Family Flow</h1>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      );
    }
    
    if (showWelcome) {
      return <WelcomeCards onComplete={handleWelcomeComplete} />;
    }
    
    switch (currentScreen) {
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
            onNavigate={setCurrentScreen}
            graduationProgress={getGraduationProgress()}
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
            onNavigate={setCurrentScreen}
            graduationProgress={getGraduationProgress()}
          />
        );
      case "screen-time":
        return (
          <ScreenTimeReflector
            familyMembers={appData.familyMembers}
            reflectionEntries={appData.reflectionEntries}
            onAddReflectionEntry={addReflectionEntry}
            onDeleteReflectionEntry={deleteReflectionEntry}
            onNavigate={setCurrentScreen}
          />
        );
      case "gratitude":
        return (
          <GratitudeFlipbook
            familyMembers={appData.familyMembers}
            gratitudeEntries={appData.gratitudeEntries}
            onAddGratitudeEntry={addGratitudeEntry}
            onDeleteGratitudeEntry={deleteGratitudeEntry}
            onNavigate={setCurrentScreen}
          />
        );
      case "guide":
        return (
          <GuidePage onNavigate={setCurrentScreen} />
        );
      case "memory":
        return (
          <MemoryCapsule 
            appData={appData} 
            onNavigate={setCurrentScreen}
            deferredPrompt={deferredPrompt}
            setDeferredPrompt={setDeferredPrompt}
            onEraseAllData={handleEraseAllData}
            onImportData={handleImportData}
          />
        );
      case "family-sync":
        return (
          <FamilySync 
            appData={appData} 
            onNavigate={setCurrentScreen}
            onImportData={handleImportData}
          />
        );
      case "graduation":
        return (
          <GraduationView
            graduationProgress={getGraduationProgress()}
            onStartReadinessAssessment={handleStartReadinessAssessment}
            onNavigate={setCurrentScreen}
          />
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
            onNavigate={setCurrentScreen}
            graduationProgress={getGraduationProgress()}
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
      
      {/* Storage Error Indicator */}
      {storageError && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-40">
          ⚠️ {storageError} - Your entries are still being saved
        </div>
      )}

      {/* PWA Update Notification - Disabled: Updates now happen silently */}

      {renderCurrentScreen()}
      {!showWelcome && (
        <Navigation
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      )}

      {/* Graduation UI Components */}
      {activeMilestones.map(milestone => (
        <MilestoneCelebration
          key={milestone.id}
          milestone={milestone}
          onCelebrationComplete={handleMilestoneCelebrationComplete}
        />
      ))}

      {currentTransitionPrompt && (
        <TransitionPrompt
          prompt={currentTransitionPrompt}
          onAction={handleTransitionPromptAction}
          onDismiss={handleTransitionPromptDismiss}
        />
      )}

      {showReadinessAssessment && (
        <ReadinessAssessment
          onComplete={handleReadinessAssessmentComplete}
          onCancel={handleReadinessAssessmentCancel}
        />
      )}
    </div>
  );
}