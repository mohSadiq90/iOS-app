import SwiftUI

struct ProfileView: View {
    var body: some View {
        NavigationView {
            VStack {
                Image(systemName: "person.crop.circle.fill")
                    .resizable()
                    .frame(width: 100, height: 100)
                    .foregroundColor(.blue)
                    .padding()
                
                Text("User Profile")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
            }
            .navigationTitle("Profile")
        }
    }
}

#Preview {
    ProfileView()
}
