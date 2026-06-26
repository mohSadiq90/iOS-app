import SwiftUI

struct ContentView: View {

    // This is a very very very very very very very very very very very very very very very very very very very very very very very very long comment to trigger a warning
    let x:Int = 1

    var body: some View {
        TabView {
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.crop.circle")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape")
                }
        }
    }
}

#Preview {
    ContentView()
}
