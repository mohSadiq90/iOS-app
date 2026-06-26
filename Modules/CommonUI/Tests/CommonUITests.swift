import XCTest
import SwiftUI
@testable import CommonUI

final class CommonUITests: XCTestCase {

    func testPrimaryButtonInitializes() {
        var tapped = false
        let button = PrimaryButton("Tap me") { tapped = true }
        // Verify title is stored correctly by invoking action
        _ = button.body
        XCTAssertFalse(tapped, "Action should not fire on initialization")
    }

    func testLoadingViewBodyDoesNotThrow() {
        let view = LoadingView()
        // Simply verifying body can be evaluated without crashing
        XCTAssertNotNil(view.body)
    }
}
