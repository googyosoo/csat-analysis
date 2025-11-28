$urls = @(
    @{ Url = "https://blog.kakaocdn.net/dna/PWXXt/dJMcajN5947/AAAAAAAAAAAAAAAAAAAAAMpYR-Sc7TdEPntu2RQoLzV8KrHLvzUDKPuoqt4ZbE0b/2025%EB%85%84%2010%EC%9B%94%20%EA%B3%A03_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=4hbwAQg4hUrYyBPMgcDTUUFGTlA%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2025_10_english.pdf" },
    @{ Url = "https://blog.kakaocdn.net/dna/lohrD/dJMb9PlWrU1/AAAAAAAAAAAAAAAAAAAAANNOgtlwYlYuTdoNzbKXxcuUo2JPOSnC5ovsSj6PsGC3/2026%ED%95%99%EB%85%84%EB%8F%84%209%EC%9B%94%20%EB%AA%A8%EC%9D%98%ED%8F%89%EA%B0%80_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=5G11tcrv9AcQrox5%2FsXhtKfa4Jw%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2026_09_mock_english.pdf" },
    @{ Url = "https://blog.kakaocdn.net/dna/c6fiRi/btsPiWgEj8C/AAAAAAAAAAAAAAAAAAAAAHDHnA_p_zMFC9khMEC98uLXqrpmJQrdnoH2nXePubEH/2025_7%EC%9B%94_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=BXoJEgIJSSzH0MMhk%2BLUmVVqWlc%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2025_07_english.pdf" },
    @{ Url = "https://blog.kakaocdn.net/dna/ooLlu/btsOt5djnNK/AAAAAAAAAAAAAAAAAAAAAAkw5S0-MMgb1cYncNYSr7TdMcdwnKSuSzgT9-q4_wyE/2026%ED%95%99%EB%85%84%EB%8F%84%206%EC%9B%94%20%EB%AA%A8%EC%9D%98%ED%8F%89%EA%B0%80_%EC%98%81%EC%96%B4%20%EB%AC%B8%EC%A0%9C.pdf?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=omsbmaMJRHZmyYXALlW8KXEEfJc%3D&attach=1&knm=tfile.pdf"; Out = "data/raw_pdfs/2026_06_mock_english.pdf" }
)

foreach ($item in $urls) {
    Write-Host "Downloading $($item.Out)..."
    Invoke-WebRequest -Uri $item.Url -OutFile $item.Out
}
