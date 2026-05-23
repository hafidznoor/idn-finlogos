import com.vanniktech.maven.publish.SonatypeHost

plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    id("com.vanniktech.maven.publish")
}

android {
    namespace = "com.hafidznoor.idnfinlogos"
    compileSdk = 34

    defaultConfig {
        minSdk = 21
        consumerProguardFiles("consumer-rules.pro")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

}

mavenPublishing {
    publishToMavenCentral(SonatypeHost.CENTRAL_PORTAL)
    signAllPublications()

    coordinates(
        groupId = project.property("GROUP") as String,
        artifactId = project.property("POM_ARTIFACT_ID") as String,
        version = project.property("VERSION_NAME") as String
    )

    pom {
        name.set("idn-finlogos")
        description.set("Indonesian financial institution logos (banks, e-wallets, payment gateways, and 20+ more categories) as optimized SVG assets, with a Kotlin lookup API.")
        url.set("https://github.com/hafidznoor/idn-finlogos")

        licenses {
            license {
                name.set("MIT License (code)")
                url.set("https://github.com/hafidznoor/idn-finlogos/blob/main/LICENSE")
            }
            license {
                name.set("CC BY-NC 4.0 (SVG assets)")
                url.set("https://github.com/hafidznoor/idn-finlogos/blob/main/LICENSE-ASSETS")
            }
        }

        developers {
            developer {
                id.set("hafidznoor")
                name.set("Hafidz Noor Fauzi")
                url.set("https://github.com/hafidznoor")
            }
        }

        scm {
            url.set("https://github.com/hafidznoor/idn-finlogos")
            connection.set("scm:git:git://github.com/hafidznoor/idn-finlogos.git")
            developerConnection.set("scm:git:ssh://git@github.com/hafidznoor/idn-finlogos.git")
        }
    }
}
