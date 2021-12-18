from flask import Flask, request

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def test():
    if request.method == "GET":
        return """
        下に整数aaaを入力してください。奇数か偶数か判定します
        <form action="/" method="POST">
        <input name="num"></input>
        </form>"""
    elif request.method == "POST":
        try:
            return """
            {}は{}です！
            <form action="/" method="POST">
            <input name="num"></input>
            </form>""".format(
                str(request.form["num"]), ["偶数", "奇数"][int(request.form["num"]) % 2]
            )
        except ValueError:
            return """
                    有効な数字ではありません！入力しなおしてください。
                    <form action="/" method="POST">
                    <input name="num"></input>
                    </form>"""


if __name__ == "__main__":
    app.run(host="localhost", port=5000)
