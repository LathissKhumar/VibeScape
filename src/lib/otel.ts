// Minimal OpenTelemetry scaffolding. Non-breaking: only activates when OTEL_ENABLED=true

type OtelClient = unknown | null;

export function initOtel(): OtelClient {
  const enabled = process.env.OTEL_ENABLED === "true";
  if (!enabled) return null;

  // Dynamically require OpenTelemetry packages to avoid build-time failures
  let NodeTracerProvider: any;
  let registerInstrumentations: any;
  let OTLPTraceExporter: any;
  let SimpleSpanProcessor: any;
  try {
    // hide static require from bundlers
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    NodeTracerProvider = req("@opentelemetry/sdk-trace-node").NodeTracerProvider;
    registerInstrumentations = req("@opentelemetry/instrumentation").registerInstrumentations;
    OTLPTraceExporter = req("@opentelemetry/exporter-trace-otlp-http").OTLPTraceExporter;
    SimpleSpanProcessor = req("@opentelemetry/sdk-trace-base").SimpleSpanProcessor;
  } catch (e) {
    return null;
  }

  const provider = new NodeTracerProvider();
  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  registerInstrumentations({
    instrumentations: [],
  });

  return { provider, exporter };
}

export const Otel = initOtel();
