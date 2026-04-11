// Global lifecycle hooks — applied to every test file automatically.
// Registered via setupFilesAfterEnv in jest.config.ts.

beforeEach(() => {
    expect.hasAssertions();
});