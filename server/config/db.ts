import fs from "fs";
import path from "path";

// Define TypeScript interfaces for our Database models
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface ClickAnalytic {
  timestamp: string;
  ip: string;
  browser: string;
  device: string;
  country: string;
}

export interface Url {
  id: string;
  userId: string | null; // null if created anonymously or public
  originalUrl: string;
  shortCode: string;
  customAlias: string | null;
  clicks: number;
  clickAnalytics: ClickAnalytic[];
  createdAt: string;
  expiresAt: string | null; // ISO Date String
  isActive: boolean;
  passwordHash: string | null; // For password protection
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
}

// Local Database File Path
const DB_FILE = path.join(process.cwd(), "db_local.json");

interface DatabaseSchema {
  users: User[];
  urls: Url[];
}

class LocalDB {
  private data: DatabaseSchema = { users: [], urls: [] };

  constructor() {
    this.load();
  }

  // Load from local file
  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
        // Ensure arrays exist
        if (!this.data.users) this.data.users = [];
        if (!this.data.urls) this.data.urls = [];
      } else {
        this.save();
      }
    } catch (error) {
      console.error("Failed to load local DB, starting fresh", error);
      this.data = { users: [], urls: [] };
    }
  }

  // Save to local file
  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save local DB", error);
    }
  }

  // Users Queries
  public users = {
    find: (): User[] => {
      this.load();
      return this.data.users;
    },
    findOne: (predicate: (user: User) => boolean): User | null => {
      this.load();
      return this.data.users.find(predicate) || null;
    },
    findById: (id: string): User | null => {
      this.load();
      return this.data.users.find((u) => u.id === id) || null;
    },
    create: (user: Omit<User, "id" | "createdAt">): User => {
      this.load();
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(newUser);
      this.save();
      return newUser;
    },
  };

  // URLs Queries
  public urls = {
    find: (predicate?: (url: Url) => boolean): Url[] => {
      this.load();
      if (predicate) {
        return this.data.urls.filter(predicate);
      }
      return this.data.urls;
    },
    findOne: (predicate: (url: Url) => boolean): Url | null => {
      this.load();
      return this.data.urls.find(predicate) || null;
    },
    findById: (id: string): Url | null => {
      this.load();
      return this.data.urls.find((u) => u.id === id) || null;
    },
    create: (url: Omit<Url, "id" | "createdAt" | "clicks" | "clickAnalytics">): Url => {
      this.load();
      const newUrl: Url = {
        ...url,
        id: Math.random().toString(36).substring(2, 11),
        clicks: 0,
        clickAnalytics: [],
        createdAt: new Date().toISOString(),
      };
      this.data.urls.push(newUrl);
      this.save();
      return newUrl;
    },
    update: (id: string, updates: Partial<Omit<Url, "id" | "createdAt" | "userId">>): Url | null => {
      this.load();
      const idx = this.data.urls.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      this.data.urls[idx] = { ...this.data.urls[idx], ...updates };
      this.save();
      return this.data.urls[idx];
    },
    delete: (id: string): boolean => {
      this.load();
      const originalLength = this.data.urls.length;
      this.data.urls = this.data.urls.filter((u) => u.id !== id);
      this.save();
      return this.data.urls.length < originalLength;
    },
    recordClick: (id: string, analytic: ClickAnalytic): Url | null => {
      this.load();
      const idx = this.data.urls.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      this.data.urls[idx].clicks += 1;
      this.data.urls[idx].clickAnalytics.push(analytic);
      this.save();
      return this.data.urls[idx];
    },
  };
}

export const db = new LocalDB();

/*
================================================================================
PRODUCTION MONGOOSE / MONGODB MODELS FOR DEPLOYMENT (Reference)
================================================================================

// 1. User Model (server/models/User.js)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);


// 2. URL Model (server/models/Url.js)
const mongoose = require('mongoose');

const ClickAnalyticSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  browser: { type: String },
  device: { type: String },
  country: { type: String }
});

const UrlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String, default: null, unique: true, sparse: true },
  clicks: { type: Number, default: 0 },
  clickAnalytics: [ClickAnalyticSchema],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  password: { type: String, default: null }, // Hashed password for protection
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }
});

module.exports = mongoose.model('Url', UrlSchema);
*/
