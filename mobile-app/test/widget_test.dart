import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ikike_health_ai/main.dart';
import 'package:provider/provider.dart';
import 'package:ikike_health_ai/providers/language_provider.dart';
import 'package:ikike_health_ai/providers/theme_provider.dart';
import 'package:ikike_health_ai/i18n/translations.g.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      TranslationProvider(
        child: MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => LanguageProvider()),
            ChangeNotifierProvider(create: (_) => ThemeProvider()),
          ],
          child: const MyApp(seenOnboarding: false),
        ),
      ),
    );

    // We expect to see the splash screen or something initially.
    // Since SplashScreen has a timer, we might just check for the MaterialApp existence.
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
