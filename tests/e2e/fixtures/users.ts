export interface TestUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const BROWSER_USERS: Record<string, TestUser> = {
  chrome: {
    name: "Chorme Test User",
    username: "chromeuser",
    email: "e2e-chrome@test.com",
    password: "password123",
  },
  firefox: {
    name: "Firefox Test User",
    username: "firefoxuser",
    email: "e2e-firefox@test.com",
    password: "password123",
  },
  safari: {
    name: "Safari Test User",
    username: "safariuser",
    email: "e2e-safari@test.com",
    password: "password123",
  },
};

export const COMMON_USERS: TestUser[] = [
  {
    name: "Regular Test User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  },
  {
    name: "Admin Test User",
    username: "adminuser",
    email: "admin@test.com",
    password: "adminpassword123",
  },
  {
    name: "Guest Test User",
    username: "guestuser",
    email: "guest@test.com",
    password: "guestpassword123",
  },

  {
    name: "John Developer",
    username: "johndev",
    email: "john@dev.com",
    password: "john123",
  },
  {
    name: "Sarah Tester",
    username: "sarahtest",
    email: "sarah@test.com",
    password: "sarah123",
  },
  {
    name: "Mike Engineer",
    username: "mikeeng",
    email: "mike@engineering.com",
    password: "mike123",
  },
  {
    name: "Emily Product",
    username: "emilyprod",
    email: "emily@product.com",
    password: "emily123",
  },
];
