// Minimal OpenTelemetry scaffolding. Non-breaking: only activates when OTEL_ENABLED=true

type NodeTracerProviderCtor = new (...args: unknown[]) => { addSpanProcessor: (sp: unknown) => void; register: () => void };
type RegisterInstrumentationsFn = (opts: { instrumentations: unknown[] }) => void;
type OTLPTraceExporterCtor = new (opts: { url?: string }) => unknown;
type SimpleSpanProcessorCtor = new (exporter: unknown) => { __brand: true };

type OtelClient = unknown | null;

export function initOtel(): OtelClient {
  const enabled = process.env.OTEL_ENABLED === "true";
  if (!enabled) return null;

  // Dynamically require OpenTelemetry packages to avoid build-time failures
  let NodeTracerProvider: NodeTracerProviderCtor;
  let registerInstrumentations: RegisterInstrumentationsFn;
  let OTLPTraceExporter: OTLPTraceExporterCtor;
  let SimpleSpanProcessor: SimpleSpanProcessorCtor;
  try {
    // hide static require from bundlers
    // eslint-disable-next-line no-eval
    const req: (id: string) => unknown = eval("require");
    NodeTracerProvider = (req("@opentelemetry/sdk-trace-node") as { NodeTracerProvider: NodeTracerProviderCtor }).NodeTracerProvider;
    registerInstrumentations = (req("@opentelemetry/instrumentation") as { registerInstrumentations: RegisterInstrumentationsFn }).registerInstrumentations;
    OTLPTraceExporter = (req("@opentelemetry/exporter-trace-otlp-http") as { OTLPTraceExporter: OTLPTraceExporterCtor }).OTLPTraceExporter;
    SimpleSpanProcessor = (req("@opentelemetry/sdk-trace-base") as { SimpleSpanProcessor: SimpleSpanProcessorCtor }).SimpleSpanProcessor;
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
