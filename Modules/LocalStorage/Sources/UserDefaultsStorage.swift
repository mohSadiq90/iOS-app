import Foundation

// MARK: - UserDefaults Storage

public final class UserDefaultsStorage: StorageProtocol {
    private let defaults: UserDefaults

    public init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    public func save<T: Codable>(_ value: T, forKey key: String) {
        let data = try? JSONEncoder().encode(value)
        defaults.set(data, forKey: key)
    }

    public func load<T: Codable>(_ type: T.Type, forKey key: String) -> T? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }

    public func remove(forKey key: String) {
        defaults.removeObject(forKey: key)
    }
}
