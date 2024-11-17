-- 読み取り操作を許可
CREATE POLICY "Allow read access for anon"
ON public."study-record"
FOR SELECT
USING (auth.role() = 'anon');

-- 挿入操作を許可
CREATE POLICY "Allow insert access for anon"
ON public."study-record"
FOR INSERT
WITH CHECK (auth.role() = 'anon');

-- 更新操作を許可
CREATE POLICY "Allow update access for anon"
ON public."study-record"
FOR UPDATE
USING (auth.role() = 'anon');

-- 削除操作を許可
CREATE POLICY "Allow delete access for anon"
ON public."study-record"
FOR DELETE
USING (auth.role() = 'anon');