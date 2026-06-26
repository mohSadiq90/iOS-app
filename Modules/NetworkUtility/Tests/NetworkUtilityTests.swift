import XCTest
@testable import NetworkUtility

final class NetworkUtilityTests: XCTestCase {

    func testBadURLThrowsError() async {
        let client = NetworkClient()
        do {
            _ = try await client.fetch(String.self, from: "not a valid url %%")
            XCTFail("Expected NetworkError.badURL to be thrown")
        } catch NetworkError.badURL {
            // expected
        } catch {
            XCTFail("Unexpected error: \(error)")
        }
    }
}
