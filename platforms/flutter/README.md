# idn_finlogos

Flutter package for the [idn-finlogos](https://github.com/hafidznoor/idn-finlogos) catalog of Indonesian financial institution logos.

**489 logos · 23 categories · raw SVG assets · zero runtime dependencies**

## Install

```bash
flutter pub add idn_finlogos flutter_svg
```

`flutter_svg` isn't a dependency of this package — pick your preferred SVG renderer.

## Render a logo

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:idn_finlogos/idn_finlogos.dart';

class BcaLogo extends StatelessWidget {
  const BcaLogo({super.key});

  @override
  Widget build(BuildContext context) {
    final bca = IdnFinLogos.get('bca');
    if (bca == null) return const SizedBox.shrink();
    return SvgPicture.asset(bca.assetPath, semanticsLabel: bca.name);
  }
}
```

## Browse the catalog

```dart
IdnFinLogos.all                          // all 489 logos
IdnFinLogos.categories                   // 23 categories
IdnFinLogos.byCategory('bank-logo')      // 153 banks
IdnFinLogos.get('gopay')                 // single lookup
IdnFinLogos.search('syariah')            // fuzzy match: name / slug / aliases
```

## License

- Package code: MIT
- Logo SVGs: CC BY-NC 4.0

Commercial use of the SVG assets requires permission from the trademark holder of each respective logo. See [NOTICE](https://github.com/hafidznoor/idn-finlogos/blob/main/NOTICE).
