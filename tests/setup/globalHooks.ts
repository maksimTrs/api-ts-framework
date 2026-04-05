// Global lifecycle hooks — applied to every test file automatically.
// Registered via setupFilesAfterFramework in jest.config.ts.

beforeEach(() => {
    expect.hasAssertions();
});