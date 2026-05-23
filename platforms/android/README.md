# idn-finlogos (Android)

Android library for the [idn-finlogos](https://github.com/hafidznoor/idn-finlogos) catalog of Indonesian financial institution logos.

**489 logos · 23 categories · zero runtime dependencies · raw SVG assets**

## Install

### Maven Central

```kotlin
dependencies {
    implementation("io.github.hafidznoor:idn-finlogos:2.0.1")
}
```

### JitPack (no Maven Central wait)

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}

// app/build.gradle.kts
dependencies {
    implementation("com.github.hafidznoor:idn-finlogos:2.0.1")
}
```

## Render a logo

The library ships raw SVGs as Android assets. The de-facto modern way to render SVG on Android is **Coil 2** with the SVG decoder:

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.coil-kt:coil-compose:2.6.0")
    implementation("io.coil-kt:coil-svg:2.6.0")
}
```

```kotlin
import androidx.compose.runtime.*
import coil.ImageLoader
import coil.compose.AsyncImage
import coil.decode.SvgDecoder
import com.hafidznoor.idnfinlogos.IdnFinLogos

@Composable
fun BcaLogo() {
    val context = LocalContext.current
    val loader = remember {
        ImageLoader.Builder(context)
            .components { add(SvgDecoder.Factory()) }
            .build()
    }
    val bca = IdnFinLogos.get("bca") ?: return

    AsyncImage(
        model = "file:///android_asset/${bca.assetPath}",
        imageLoader = loader,
        contentDescription = bca.name,
    )
}
```

For classic Views, [AndroidSVG](https://bigbadaboom.github.io/androidsvg/) works the same way — open the asset stream and parse.

## Browse the catalog

```kotlin
IdnFinLogos.all                          // all 489 logos
IdnFinLogos.categories                   // 23 categories
IdnFinLogos.byCategory("bank-logo")      // 153 banks
IdnFinLogos.get("gopay")                 // single lookup
IdnFinLogos.search("syariah")            // fuzzy match: name / slug / aliases
```

## License

- Library code: MIT
- Logo SVGs: CC BY-NC 4.0

Commercial use of the SVG assets requires permission from the trademark holder of each respective logo. See [NOTICE](https://github.com/hafidznoor/idn-finlogos/blob/main/NOTICE).
