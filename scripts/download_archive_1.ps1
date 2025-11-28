$urls = @(
    @{ Url = "https://blog.kakaocdn.net/dna/cnRRi6/btsNTxu5uPS/AAAAAAAAAAAAAAAAAAAAAMxFX0-TjJlHGQaQQNUXEFCnVpmW2Hd-Ky1o7huC5Nnq/2025%EB%85%84%205%EC%9B%94%20%EA%B3%A03_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=g8HQjwNYmZFR2gVtriCe2B2BmDE%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2025_05_english.pdf" },
    @{ Url = "https://blog.kakaocdn.net/dna/oJlMf/btsNDMNTbHt/AAAAAAAAAAAAAAAAAAAAANcQ8TYM3-7OmWMrbWlzmTbeA5EfKJJXdH8rZVAX8eTt/2025%EB%85%84%203%EC%9B%94_%EA%B3%A03_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=DqQ%2BpununWxankBmgzSFHThvao8%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2025_03_english.pdf" },
    @{ Url = "https://blog.kakaocdn.net/dna/c6bbYO/btsKMi8TtcV/AAAAAAAAAAAAAAAAAAAAAF5SfElbcrkNnw2_2de5etmhWMMne8VviVG348K8Qdeo/2025%ED%95%99%EB%85%84%EB%8F%84%20%EC%88%98%EB%8A%A5_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=HkQSs%2FLVVNJOVL5mY8PdDcTghN8%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2025_suneung_english.pdf" }
)

foreach ($item in $urls) {
    Write-Host "Downloading $($item.Out)..."
    Invoke-WebRequest -Uri $item.Url -OutFile $item.Out
}
