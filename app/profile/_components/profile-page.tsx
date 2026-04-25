"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BillingSection } from "./billing-section";
import {
  User,
  Mail,
  Calendar,
  File,
  Folder,
  Trash2,
  Lock,
  AlertTriangle,
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  isPro: boolean;
  stripeCustomerId: string | null;
  stats: {
    items: number;
    collections: number;
    breakdown: {
      typeId: string;
      name: string;
      icon: string;
      color: string;
      count: number;
    }[];
  };
  authMethods: {
    hasPassword: boolean;
    hasGitHub: boolean;
  };
  priceIds: {
    monthly: string;
    yearly: string;
  };
}

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== profile?.email) {
      setPasswordError("Email does not match");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
      });

      if (!res.ok) {
        setPasswordError("Failed to delete account");
        return;
      }

      await signOut({ callbackUrl: "/sign-in" });
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500">{error || "Failed to load profile"}</p>
      </div>
    );
  }

  const createdDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* User Info */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar src={profile.image} name={profile.name} className="h-20 w-20 text-xl" />
          <div>
            <h2 className="text-xl font-semibold">{profile.name || "User"}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {profile.email}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              Member since {createdDate}
            </p>
          </div>
        </div>

        {/* Auth Methods */}
        <div className="mt-4 flex gap-2">
          {profile.authMethods.hasGitHub && (
            <Badge variant="secondary">GitHub</Badge>
          )}
          {profile.authMethods.hasPassword && (
            <Badge variant="secondary">Email/Password</Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{profile.stats.items}</p>
              <p className="text-sm text-muted-foreground">Items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{profile.stats.collections}</p>
              <p className="text-sm text-muted-foreground">Collections</p>
            </div>
          </div>
        </div>

        {/* Breakdown by Type */}
        {profile.stats.breakdown.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Items by type:</p>
            <div className="flex flex-wrap gap-2">
              {profile.stats.breakdown.map((item) => {
                const Icon = iconMap[item.icon] || File;
                return (
                  <Badge
                    key={item.typeId}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Icon className="h-3 w-3" style={{ color: item.color }} />
                    {item.name}: {item.count}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Billing */}
      {profile.priceIds?.monthly && profile.priceIds?.yearly && (
        <BillingSection
          isPro={profile.isPro}
          stripeCustomerId={profile.stripeCustomerId}
          monthlyPriceId={profile.priceIds.monthly}
          yearlyPriceId={profile.priceIds.yearly}
        />
      )}

      {/* Change Password */}
      {profile.authMethods.hasPassword && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Change Password</h3>

          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Lock className="h-4 w-4" />
              Change password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />

              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-green-500">{passwordSuccess}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isChangingPassword ? "Saving..." : "Save password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Delete Account */}
      <div className="rounded-lg border border-red-200 bg-red-50/50 p-6">
        <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account is permanent. All your data will be lost forever.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-sm text-red-600 hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-md bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                This action cannot be undone. Type your email <strong>{profile.email}</strong> to confirm.
              </p>
            </div>

            <input
              type="email"
              placeholder="Enter your email to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="flex h-10 w-full rounded-md border border-red-300 bg-background px-3 py-2 text-sm"
            />

            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== profile.email}
                className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete forever"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                  setPasswordError("");
                }}
                className="flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
