package com.tudope.openapi_server.constants;

import java.util.Set;

public final class ElectricProtocol {

    // https://github.com/electric-sql/electric/blob/2d7e2d6bdfc33e403a3176690c09a3fbfd8af88a/packages/typescript-client/src/constants.ts

    private ElectricProtocol() {
    }

    public static final String LIVE_CACHE_BUSTER_HEADER = "electric-cursor";
    public static final String SHAPE_HANDLE_HEADER = "electric-handle";
    public static final String CHUNK_LAST_OFFSET_HEADER = "electric-offset";
    public static final String SHAPE_SCHEMA_HEADER = "electric-schema";
    public static final String CHUNK_UP_TO_DATE_HEADER = "electric-up-to-date";

    public static final String COLUMNS_QUERY_PARAM = "columns";
    public static final String LIVE_CACHE_BUSTER_QUERY_PARAM = "cursor";
    public static final String EXPIRED_HANDLE_QUERY_PARAM = "expired_handle";
    public static final String SHAPE_HANDLE_QUERY_PARAM = "handle";
    public static final String LIVE_QUERY_PARAM = "live";
    public static final String OFFSET_QUERY_PARAM = "offset";
    public static final String TABLE_QUERY_PARAM = "table";
    public static final String WHERE_QUERY_PARAM = "where";
    public static final String REPLICA_PARAM = "replica";
    public static final String WHERE_PARAMS_PARAM = "params";

    public static final String LIVE_SSE_QUERY_PARAM = "live_sse";
    public static final String FORCE_DISCONNECT_AND_REFRESH = "force-disconnect-and-refresh";
    public static final String PAUSE_STREAM = "pause-stream";
    public static final String SYSTEM_WAKE = "system-wake";
    public static final String LOG_MODE_QUERY_PARAM = "log";

    public static final String SUBSET_PARAM_WHERE = "subset__where";
    public static final String SUBSET_PARAM_LIMIT = "subset__limit";
    public static final String SUBSET_PARAM_OFFSET = "subset__offset";
    public static final String SUBSET_PARAM_ORDER_BY = "subset__order_by";
    public static final String SUBSET_PARAM_WHERE_PARAMS = "subset__params";
    public static final String SUBSET_PARAM_WHERE_EXPR = "subset__where_expr";
    public static final String SUBSET_PARAM_ORDER_BY_EXPR = "subset__order_by_expr";

    public static final String CACHE_BUSTER_QUERY_PARAM = "cache-buster";

    public static final Set<String> ELECTRIC_PROTOCOL_QUERY_PARAMS = Set.of(
            LIVE_QUERY_PARAM,
            LIVE_SSE_QUERY_PARAM,
            SHAPE_HANDLE_QUERY_PARAM,
            OFFSET_QUERY_PARAM,
            LIVE_CACHE_BUSTER_QUERY_PARAM,
            EXPIRED_HANDLE_QUERY_PARAM,
            LOG_MODE_QUERY_PARAM,
            SUBSET_PARAM_WHERE,
            SUBSET_PARAM_LIMIT,
            SUBSET_PARAM_OFFSET,
            SUBSET_PARAM_ORDER_BY,
            SUBSET_PARAM_WHERE_PARAMS,
            SUBSET_PARAM_WHERE_EXPR,
            SUBSET_PARAM_ORDER_BY_EXPR,
            CACHE_BUSTER_QUERY_PARAM
    );

}
