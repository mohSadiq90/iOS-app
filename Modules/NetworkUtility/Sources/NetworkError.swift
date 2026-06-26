import Foundation

// MARK: - Network Error

public enum NetworkError: Error {
    case badURL
    case requestFailed(statusCode: Int)
    case noData
    case decodingFailed(Error)
}
