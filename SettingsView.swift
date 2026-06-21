import SwiftUI

struct SettingsView: View {
    @State private var notificationsEnabled = true
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Preferences")) {
                    Toggle("Enable Notifications", isOn: $notificationsEnabled)
                }
                
                Section {
                    Button("Log Out") {
                        // Action
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
        }
    }
}

#Preview {
    SettingsView()
}
