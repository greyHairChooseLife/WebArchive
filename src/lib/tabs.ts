export type LiveTab = {
    id: number;
    url: string;
    title: string;
    favIconUrl: string;
    windowId: number;
    lastAccessed: number;
};

export async function queryAllTabs(): Promise<LiveTab[]> {
    const tabs = await chrome.tabs.query({});
    return tabs
        .filter(
            (tab): tab is chrome.tabs.Tab & { id: number; url: string } =>
                tab.id !== undefined && !!tab.url,
        )
        .map((tab) => ({
            id: tab.id,
            url: tab.url,
            title: tab.title ?? tab.url,
            favIconUrl: tab.favIconUrl ?? '',
            windowId: tab.windowId,
            lastAccessed: tab.lastAccessed ?? 0,
        }));
}

export function getDomain(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

export type GroupedTabs = {
    label: string;
    tabs: LiveTab[];
};

// 윈도우 id는 노출하지 않고 구분만. 현재 윈도우는 강조 라벨, 나머지는 등장 순번.
export function groupByWindow(
    tabs: LiveTab[],
    currentWindowId?: number,
): GroupedTabs[] {
    const byWindow = new Map<number, LiveTab[]>();
    for (const tab of tabs) {
        const group = byWindow.get(tab.windowId) ?? [];
        group.push(tab);
        byWindow.set(tab.windowId, group);
    }
    let otherCount = 0;
    return Array.from(byWindow.entries()).map(([windowId, windowTabs]) => {
        const label =
            windowId === currentWindowId
                ? '현재 윈도우'
                : `다른 윈도우 ${++otherCount}`;
        return { label, tabs: windowTabs };
    });
}

export function groupByDomain(tabs: LiveTab[]): GroupedTabs[] {
    const byDomain = new Map<string, LiveTab[]>();
    for (const tab of tabs) {
        const domain = getDomain(tab.url);
        const group = byDomain.get(domain) ?? [];
        group.push(tab);
        byDomain.set(domain, group);
    }
    return Array.from(byDomain.entries()).map(([domain, domainTabs]) => ({
        label: domain,
        tabs: domainTabs,
    }));
}

// D23: 시간대 버킷 경계(ms). 마지막 본 지 경과 기준, 상호배타.
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const TIME_BUCKETS = [
    { label: '방금(5분 이내)', maxAgeMs: 5 * MINUTE },
    { label: '아까(1시간 이내)', maxAgeMs: HOUR },
    { label: '오늘', maxAgeMs: DAY },
    { label: '며칠 전', maxAgeMs: 7 * DAY },
    { label: '오래됨', maxAgeMs: Infinity },
];

export function groupByTimeBucket(
    tabs: LiveTab[],
    now: number = Date.now(),
): GroupedTabs[] {
    const buckets = new Map<string, LiveTab[]>();
    for (const tab of tabs) {
        const age = now - tab.lastAccessed;
        const bucket = TIME_BUCKETS.find((b) => age <= b.maxAgeMs);
        const label =
            bucket?.label ?? TIME_BUCKETS[TIME_BUCKETS.length - 1].label;
        const group = buckets.get(label) ?? [];
        group.push(tab);
        buckets.set(label, group);
    }
    return TIME_BUCKETS.filter((b) => buckets.has(b.label)).map((b) => ({
        label: b.label,
        tabs: buckets.get(b.label) ?? [],
    }));
}

export function formatLastAccessed(
    lastAccessed: number,
    now: number = Date.now(),
): string {
    const age = now - lastAccessed;
    if (age < MINUTE) return '방금 전';
    if (age < HOUR) return `${Math.floor(age / MINUTE)}분 전`;
    if (age < DAY) return `${Math.floor(age / HOUR)}시간 전`;
    return `${Math.floor(age / DAY)}일 전`;
}

// onUpdated 폭증(단일 네비게이션당 수 회) 완화용. cancel로 대기 타이머 정리.
type Debounced = (() => void) & { cancel: () => void };

export function debounce(fn: () => void, delayMs: number): Debounced {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const debounced = () => {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(fn, delayMs);
    };
    debounced.cancel = () => {
        if (timer !== undefined) clearTimeout(timer);
    };
    return debounced;
}
