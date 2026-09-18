import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


baseline_dir = Path(sys.argv[1])
current_dir = Path(sys.argv[2])

baseline_report = json.loads((baseline_dir / "report.json").read_text(encoding="utf-8"))
current_report = json.loads((current_dir / "report.json").read_text(encoding="utf-8"))

baseline_by_key = {(item["mode"], item["page"]): item for item in baseline_report}
current_by_key = {(item["mode"], item["page"]): item for item in current_report}

metric_differences = []
image_differences = []

for key, baseline in baseline_by_key.items():
    current = current_by_key.get(key)
    if current is None:
        metric_differences.append({"key": key, "reason": "missing current report"})
        continue

    comparable_baseline = {
        "status": baseline["status"],
        "pageErrors": baseline["pageErrors"],
        "metrics": baseline["metrics"],
    }
    comparable_current = {
        "status": current["status"],
        "pageErrors": current["pageErrors"],
        "metrics": current["metrics"],
    }
    if comparable_baseline != comparable_current:
        metric_differences.append({
            "key": key,
            "baseline": comparable_baseline,
            "current": comparable_current,
        })

    image_name = f"{key[0]}-{key[1].removesuffix('.html')}.png"
    baseline_image = Image.open(baseline_dir / image_name).convert("RGBA")
    current_image = Image.open(current_dir / image_name).convert("RGBA")
    if baseline_image.size != current_image.size:
        image_differences.append({
            "image": image_name,
            "baselineSize": baseline_image.size,
            "currentSize": current_image.size,
        })
        continue

    difference = ImageChops.difference(baseline_image, current_image)
    if difference.getbbox() is not None:
        statistics = ImageStat.Stat(difference)
        image_differences.append({
            "image": image_name,
            "bbox": difference.getbbox(),
            "meanChannelDifference": [round(value, 6) for value in statistics.mean],
        })

result = {
    "comparedReports": len(baseline_by_key),
    "metricDifferences": metric_differences,
    "imageDifferences": image_differences,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
sys.exit(1 if metric_differences or image_differences else 0)
