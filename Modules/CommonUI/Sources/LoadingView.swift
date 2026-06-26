import SwiftUI

// MARK: - Loading View

public struct LoadingView: View {
    public init() {}

    public var body: some View {
        ZStack {
            Color.black.opacity(0.3)
                .ignoresSafeArea()
            ProgressView()
                .tint(.white)
                .scaleEffect(1.5)
        }
    }
}
