#!/usr/bin/env python3
"""
Nesture Journal - Worldwide News Scraper & Ingestion Engine (Python)
Automated real estate news crawler for global & national sources:
The Real Deal, HousingWire, PropertyWire, Realty & More, Economic Times Realty, etc.
"""

import sys
import os
import re
import json
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

FEEDS = [
    {
        "name": "The Real Deal",
        "url": "https://therealdeal.com/feed/",
        "region": "Global & US",
        "defaultCategory": "commercial",
    },
    {
        "name": "HousingWire",
        "url": "https://www.housingwire.com/feed/",
        "region": "North America",
        "defaultCategory": "residential",
    },
    {
        "name": "PropertyWire",
        "url": "https://www.propertywire.com/feed/",
        "region": "UK & International",
        "defaultCategory": "international",
    },
    {
        "name": "Realty & More",
        "url": "https://realtynmore.com/feed/",
        "region": "India National",
        "defaultCategory": "development",
    },
    {
        "name": "Economic Times Realty",
        "url": "https://economictimes.indiatimes.com/industry/services/property-/-cstruction/rssfeeds/2143429.cms",
        "region": "India Institutional",
        "defaultCategory": "finance",
    },
    {
        "name": "The Hindu BusinessLine Real Estate",
        "url": "https://www.thehindubusinessline.com/news/real-estate/feeder/default.rss",
        "region": "India Markets",
        "defaultCategory": "legal",
    },
    {
        "name": "Curbed",
        "url": "https://www.curbed.com/rss/index.xml",
        "region": "Global Architecture",
        "defaultCategory": "realty-tech",
    },
]

CATEGORY_BACKUP_IMAGES = {
    "residential": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "commercial": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "development": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    "finance": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    "legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "realty-tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "international": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    "general": "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
}

def clean_html(text):
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = clean.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#039;', "'")
    return re.sub(r'\s+', ' ', clean).strip()

def classify(text, default_cat="general"):
    t = text.lower()
    rules = [
        ("legal", ["rera", "supreme court", "high court", "tribunal", "ruling", "lawsuit", "penalty", "compliance", "illegal pre-launch", "dispute"]),
        ("finance", ["reit", "private equity", "interest rate", "repo rate", "mortgage rate", "debt", "funding", "bond yield", "rbi", "sebi", "ipo"]),
        ("realty-tech", ["proptech", "ai", "artificial intelligence", "smart city", "3d model", "digital twin", "virtual tour", "bim", "automation", "iot"]),
        ("development", ["airport", "highway", "corridor", "jewar", "metro line", "expressway", "infrastructure", "master plan", "township", "construction"]),
        ("commercial", ["commercial", "office leasing", "co-working", "grade a", "business park", "warehousing", "logistics park", "retail mall", "gcc"]),
        ("international", ["dubai", "london", "manhattan", "new york", "cross-border", "singapore", "european property", "sovereign wealth", "global luxury"]),
        ("residential", ["residential", "apartment", "housing unit", "homebuyer", "villa", "condo", "luxury flat", "penthouse", "rental yield"]),
    ]
    for cat, kws in rules:
        for kw in kws:
            if kw in t:
                return cat
    return default_cat

def fetch_feed(feed):
    req = urllib.request.Request(
        feed["url"],
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            return content
    except Exception as e:
        print(f"[-] Error fetching {feed['name']}: {e}", file=sys.stderr)
        return None

def parse_items(xml_str, feed):
    items = []
    item_blocks = re.findall(r'<(?:item|entry)[\s>](.*?)<\/(?:item|entry)>', xml_str, re.DOTALL)
    for block in item_blocks:
        t_match = re.search(r'<title[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>', block, re.DOTALL)
        if not t_match:
            continue
        title = clean_html(t_match.group(1) or t_match.group(2) or "")
        if len(title) < 8:
            continue

        l_match = re.search(r'<link[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>', block, re.DOTALL)
        link = ""
        if l_match:
            link = (l_match.group(1) or l_match.group(2) or "").strip()
        else:
            href_match = re.search(r'<link[^>]+href=["\']([^"\']+)["\']', block)
            if href_match:
                link = href_match.group(1).strip()
        if not link:
            continue

        d_match = re.search(r'<description[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/description>', block, re.DOTALL)
        desc = clean_html(d_match.group(1) or d_match.group(2) or "") if d_match else ""

        img = ""
        img_match = re.search(r'<(?:media:content|enclosure)[^>]+url=["\']([^"\']+)["\']', block)
        if img_match:
            img = img_match.group(1)
        else:
            img_tag = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', block)
            if img_tag:
                img = img_tag.group(1)

        category = classify(title + " " + desc, feed["defaultCategory"])
        if not img or not img.startswith("http"):
            img = CATEGORY_BACKUP_IMAGES.get(category, CATEGORY_BACKUP_IMAGES["general"])

        items.append({
            "title": title,
            "sourceUrl": link,
            "sourceName": feed["name"],
            "shortDescription": desc[:240] + ("..." if len(desc) > 240 else ""),
            "category": category,
            "featuredImage": img,
            "seoTitle": f"{title} | Nesture Journal",
            "seoDescription": desc[:160],
        })
    return items

def trigger_local_ingest():
    """Trigger the local API to ingest newly scraped stories into PostgreSQL"""
    url = "http://localhost:3000/api/sources/scrape"
    req = urllib.request.Request(
        url,
        data=b"{}",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer nesture-internal-cron",
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print("[+] Ingest API response:", data.get("message"))
            return data
    except Exception as e:
        print("[-] API call notice:", e)
        return None

def main():
    print(f"[{datetime.now().isoformat()}] Starting Worldwide Real Estate Scraper...")
    all_stories = []
    for feed in FEEDS:
        xml = fetch_feed(feed)
        if xml:
            stories = parse_items(xml, feed)
            print(f"[+] {feed['name']}: Fetched {len(stories)} stories")
            all_stories.extend(stories)

    print(f"[+] Total worldwide stories parsed: {len(all_stories)}")
    # Trigger local API ingestion
    trigger_local_ingest()

if __name__ == "__main__":
    main()
