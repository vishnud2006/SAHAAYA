import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import {
  findUserByEmail,
  findUserById,
  createUser,
  createCase,
  getCasesByUserId,
  getCaseById,
  updateCaseActions,
  updateCaseFull,
  updateUserProfile,
  changeUserPassword,
  deleteCase,
  getDashboardStats,
} from "../src/lib/db";
import { hashPassword, verifyPassword } from "../src/lib/auth";

async function runTests() {
  console.log("🧪 Starting SAHAAYA Phase 16 Database Layer Verification...");

  const timestamp = Date.now();
  const testEmail1 = `test_user_${timestamp}_1@example.com`;
  const testEmail2 = `test_user_${timestamp}_2@example.com`;

  // 1. Create User 1
  console.log("\n1. Testing createUser & password hashing...");
  const { hash: hash1, salt: salt1 } = hashPassword("SecurePass123!");
  const user1 = await createUser("Test Citizen One", testEmail1, hash1, salt1);
  console.log(`   ✓ Created User 1: ${user1.id} (${user1.email})`);

  // 2. Find User by Email
  console.log("\n2. Testing findUserByEmail...");
  const foundUser1 = await findUserByEmail(testEmail1);
  if (!foundUser1 || foundUser1.id !== user1.id) {
    throw new Error("findUserByEmail failed to retrieve created user.");
  }
  console.log(`   ✓ Found user by email successfully: ${foundUser1.name}`);

  // 3. Find User by ID
  console.log("\n3. Testing findUserById...");
  const foundById = await findUserById(user1.id);
  if (!foundById || foundById.email !== user1.email) {
    throw new Error("findUserById failed.");
  }
  console.log(`   ✓ Found user by ID successfully: ${foundById.id}`);

  // 4. Create User 2 (for multi-tenant isolation testing)
  console.log("\n4. Testing multi-user creation (User 2)...");
  const { hash: hash2, salt: salt2 } = hashPassword("SecurePass456!");
  const user2 = await createUser("Test Citizen Two", testEmail2, hash2, salt2);
  console.log(`   ✓ Created User 2: ${user2.id} (${user2.email})`);

  // 5. Create Case for User 1
  console.log("\n5. Testing createCase for User 1...");
  const sampleResult: any = {
    situation: "You lost your driving license and need to apply for a duplicate online.",
    intent: "Recover lost driving license via Sarathi Parivahan portal.",
    priority: "MEDIUM",
    whatMayHelp: [
      {
        title: "Parivahan Sarathi Portal",
        description: "Official Ministry of Road Transport portal for DL services.",
        whyRelevant: "Direct digital pathway for duplicate license application.",
        portalUrl: "parivahan.gov.in",
      },
    ],
    whyRelevant: ["Applicable for all Indian driving license holders."],
    informationStillNeeded: ["DL Number or registered mobile number."],
    actions: [
      {
        title: "File Online LDR (Lost Document Report)",
        description: "Submit online loss complaint on state police portal.",
        reason: "Required as proof of loss for duplicate issuance.",
        status: "not_started",
      },
      {
        title: "Submit Form LLD on Parivahan",
        description: "Visit parivahan.gov.in and select 'Apply for Duplicate DL'.",
        reason: "Official statutory application for replacement license.",
        status: "not_started",
      },
    ],
    documentsNeeded: ["FIR/LDR Copy", "Aadhaar Card", "Form 1 (Self-declaration)"],
    importantInfo: ["Statutory fee is ₹200 + postal charge; avoid middlemen."],
    recommendedNextStep: "👉 File an online Lost Document Report on your state police portal.",
    detectedInformation: [{ label: "Document Type", value: "Driving License" }],
    verified: ["User reported loss of physical license."],
    needsConfirmation: ["Driving License number"],
    resources: [{ type: "Transport Department", description: "RTO Parivahan Sewa" }],
    warnings: ["Never pay unverified third-party agents."],
  };

  const case1 = await createCase({
    userId: user1.id,
    title: "Lost Driving License Recovery",
    rawInput: "I lost my driving license in the market yesterday. How do I get a duplicate?",
    priority: "MEDIUM",
    inputSources: ["text"],
    result: sampleResult,
  });
  console.log(`   ✓ Created Case 1: ${case1.id} for User 1`);

  // 6. Verify getCasesByUserId for User 1
  console.log("\n6. Testing getCasesByUserId...");
  const user1Cases = await getCasesByUserId(user1.id);
  if (user1Cases.length !== 1 || user1Cases[0].id !== case1.id) {
    throw new Error("getCasesByUserId did not return the expected case for User 1.");
  }
  console.log(`   ✓ Retrieved ${user1Cases.length} case(s) for User 1`);

  // 7. Test Strict Cross-User Isolation (User 2 CANNOT access User 1's case)
  console.log("\n7. Testing Data Ownership & Cross-User Security...");
  const crossAccessAttempt = await getCaseById(case1.id, user2.id);
  if (crossAccessAttempt !== null) {
    throw new Error("SECURITY VIOLATION: User 2 was able to retrieve User 1's case!");
  }
  console.log(`   🔒 SECURITY VERIFIED: User 2 cannot access User 1's case (returned null)`);

  const user2Cases = await getCasesByUserId(user2.id);
  if (user2Cases.length !== 0) {
    throw new Error("User 2 should have 0 cases.");
  }
  console.log(`   🔒 SECURITY VERIFIED: User 2 case list is isolated (0 cases)`);

  // 8. Test Update Case Actions
  console.log("\n8. Testing updateCaseActions...");
  const updatedActions: any = [
    { ...sampleResult.actions[0], status: "completed" },
    { ...sampleResult.actions[1], status: "in_progress" },
  ];
  const updatedCaseWithActions = await updateCaseActions(case1.id, user1.id, updatedActions);
  if (
    !updatedCaseWithActions ||
    updatedCaseWithActions.result.actions[0].status !== "completed" ||
    updatedCaseWithActions.result.actions[1].status !== "in_progress"
  ) {
    throw new Error("updateCaseActions failed to persist action progress.");
  }
  console.log(`   ✓ Case actions updated and persisted successfully`);

  // 9. Test Dashboard Stats
  console.log("\n9. Testing getDashboardStats...");
  const stats1 = await getDashboardStats(user1.id);
  console.log(`   ✓ Dashboard stats:`, stats1);
  if (stats1.totalAnalyses !== 1 || stats1.completedActions !== 1) {
    throw new Error("Dashboard stats calculation mismatch.");
  }

  // 10. Test Update Profile
  console.log("\n10. Testing updateUserProfile...");
  const updatedProfile = await updateUserProfile(user1.id, "Test Citizen One (Updated)");
  if (!updatedProfile || updatedProfile.name !== "Test Citizen One (Updated)") {
    throw new Error("updateUserProfile failed.");
  }
  console.log(`   ✓ Profile updated: ${updatedProfile.name}`);

  // 11. Test Change Password
  console.log("\n11. Testing changeUserPassword...");
  const { hash: newHash, salt: newSalt } = hashPassword("BrandNewPass789!");
  const pwChanged = await changeUserPassword(user1.id, newHash, newSalt);
  if (!pwChanged) {
    throw new Error("changeUserPassword failed.");
  }
  const reloadedUser = await findUserById(user1.id);
  if (!verifyPassword("BrandNewPass789!", reloadedUser!.passwordHash, reloadedUser!.salt)) {
    throw new Error("New password verification failed.");
  }
  console.log(`   ✓ Password updated and verified successfully`);

  // 12. Test Delete Case
  console.log("\n12. Testing deleteCase & ownership verification...");
  // User 2 cannot delete User 1's case
  const unauthorizedDelete = await deleteCase(case1.id, user2.id);
  if (unauthorizedDelete) {
    throw new Error("SECURITY VIOLATION: User 2 was able to delete User 1's case!");
  }
  console.log(`   🔒 SECURITY VERIFIED: User 2 cannot delete User 1's case`);

  // User 1 deletes their own case
  const authorizedDelete = await deleteCase(case1.id, user1.id);
  if (!authorizedDelete) {
    throw new Error("Authorized deleteCase failed.");
  }
  const deletedCheck = await getCaseById(case1.id, user1.id);
  if (deletedCheck !== null) {
    throw new Error("Deleted case still found in database.");
  }
  console.log(`   ✓ Case deleted successfully by owner`);

  console.log("\n=======================================================");
  console.log("🎉 ALL 12 DATABASE & OWNERSHIP TESTS PASSED WITH 100% SUCCESS!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

