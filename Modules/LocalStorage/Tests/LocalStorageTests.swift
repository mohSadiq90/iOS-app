import XCTest
@testable import LocalStorage

final class LocalStorageTests: XCTestCase {
    var storage: UserDefaultsStorage!

    override func setUp() {
        super.setUp()
        // Use a clean in-memory suite to avoid polluting .standard
        storage = UserDefaultsStorage(defaults: UserDefaults(suiteName: "test_suite")!)
    }

    override func tearDown() {
        storage.remove(forKey: "test_key")
        super.tearDown()
    }

    func testSaveAndLoad() {
        storage.save("hello", forKey: "test_key")
        let result: String? = storage.load(String.self, forKey: "test_key")
        XCTAssertEqual(result, "hello")
    }

    func testRemove() {
        storage.save("hello", forKey: "test_key")
        storage.remove(forKey: "test_key")
        let result: String? = storage.load(String.self, forKey: "test_key")
        XCTAssertNil(result)
    }
}
