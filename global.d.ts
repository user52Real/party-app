declare namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof import("mongoose") | null;
        promise: Promise<typeof import("mongoose")> | null;
      };
    }
  }
  
  // Ensure this file is included in your TypeScript compilation
  export {};