import Foundation

// MARK: - Network Client

public final class NetworkClient {
    private let session: URLSession

    public init(session: URLSession = .shared) {
        self.session = session
    }

    /// Fetch and decode a `Decodable` response from a URL string.
    public func fetch<T: Decodable>(_ type: T.Type, from urlString: String) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw NetworkError.badURL
        }

        let (data, response) = try await session.data(from: url)

        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw NetworkError.requestFailed(statusCode: http.statusCode)
        }

        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw NetworkError.decodingFailed(error)
        }
    }
}
